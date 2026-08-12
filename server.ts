import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  analyzeRealWorldObjects,
  analyzeStudentObservation,
  generateBuildFromKnowledge,
  generateInterventionDetails,
} from './src/lib/gemini';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Observation Analysis
  app.post('/api/analyze', async (req, res) => {
    try {
      const result = await analyzeStudentObservation(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/analyze error:', err?.message || 'Unknown error');
      res.status(500).json({ error: 'Something went wrong while generating the learning insight. Please try again.' });
    }
  });

  // AI Micro-Intervention Generation
  app.post('/api/intervention', async (req, res) => {
    try {
      const result = await generateInterventionDetails(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/intervention error:', err?.message || 'Unknown error');
      res.status(500).json({ error: 'Something went wrong while generating the learning insight. Please try again.' });
    }
  });

  // Real-World Context Engine
  app.post('/api/context', async (req, res) => {
    try {
      const result = await analyzeRealWorldObjects(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/context error:', err?.message || 'Unknown error');
      res.status(500).json({ error: 'Something went wrong while generating the learning insight. Please try again.' });
    }
  });

  // Build From What They Know Bridge
  app.post('/api/build-from-knowledge', async (req, res) => {
    try {
      const result = await generateBuildFromKnowledge(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/build-from-knowledge error:', err?.message || 'Unknown error');
      res.status(500).json({ error: 'Something went wrong while generating the learning insight. Please try again.' });
    }
  });

  // Vite Middleware in Development vs Static File Serving in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Learning Lens server running on http://localhost:${PORT}`);
  });
}

startServer();
