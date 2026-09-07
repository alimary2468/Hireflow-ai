import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { prisma } from './db/prisma';
import { seedDemoData } from './db/seed';

import jobRoutes from './routes/jobRoutes';
import candidateRoutes from './routes/candidateRoutes';
import screeningRoutes from './routes/screeningRoutes';
import interviewRoutes from './routes/interviewRoutes';
import notificationRoutes from './routes/notificationRoutes';
import statsRoutes from './routes/statsRoutes';
import demoRoutes from './routes/demoRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded files safely
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/screening', screeningRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/demo', demoRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 5);

  return res.json({
    status: 'online',
    appName: 'HireFlow AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiMode: geminiConfigured || openaiConfigured ? 'Live LLM API' : 'Smart Fallback Engine (Demo Mode)',
    providers: {
      gemini: geminiConfigured,
      openai: openaiConfigured,
      clerk: Boolean(process.env.VITE_CLERK_PUBLISHABLE_KEY),
    },
  });
});

// Serve Frontend static production bundle if built (Unified Production Server)
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`[PRODUCTION SERVER] Serving static client build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  console.log('[DEVELOPMENT SERVER] Client dist not found. Run "npm run dev" or "npm run build" to generate client bundle.');
}

// Start Server & Check Initial DB State
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 HireFlow AI Backend Server active on port ${PORT}`);
  console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);

  try {
    const jobCount = await prisma.job.count();
    if (jobCount === 0) {
      console.log('Database empty. Auto-seeding initial HireFlow AI demo data...');
      await seedDemoData();
    }
  } catch (err) {
    console.warn('Initial seed check note:', err);
  }
});
