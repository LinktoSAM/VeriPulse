import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { auditRouter, seedDatabase } from './routes/audit.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', auditRouter);

// Root greeting / health
app.get('/', (_req, res) => {
  res.json({
    name: 'VeriPulse Fact-Verification & Deepfake Audit API',
    version: '1.0.0',
    hackathon: 'IDEA//FORGE Online (Track 1: Civic Pulse & Digital Governance)',
    endpoints: {
      health: 'GET /api/health',
      auditText: 'POST /api/audit/text',
      auditMedia: 'POST /api/audit/media',
      auditReport: 'GET /api/audit/:id',
      auditFeed: 'GET /api/audits/feed',
    },
  });
});

// Start Server
async function startServer() {
  await connectDB();
  await seedDatabase();

  app.listen(config.port, () => {
    console.log(`🚀 VeriPulse API server running on port ${config.port}`);
    console.log(`   Health check: http://localhost:${config.port}/api/health`);
    console.log(`   Audit Feed:   http://localhost:${config.port}/api/audits/feed`);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

