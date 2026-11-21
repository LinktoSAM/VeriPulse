import { Router, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import {
  AuditReportModel,
  IAuditReport,
  InputType,
} from '../models/AuditReport.js';
import { isDbConnected } from '../config/db.js';
import { config } from '../config/env.js';
import { analyzeClaimsAndTimeline, ClaimsAnalysisResult } from '../services/claims.js';
import { analyzeMediaForensics } from '../services/forensics.js';
import { parseMediaMetadata } from '../services/metadata.js';
import { calculateAuthenticityScore } from '../services/scoring.js';
import { isGeminiConfigured } from '../services/gemini.js';

export const auditRouter = Router();

// Configure Multer for in-memory temporary processing (max 25 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxFileSizeMb * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'video/mp4',
      'video/quicktime',
      'video/webm',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: JPG, PNG, WEBP, MP3, WAV, OGG, MP4`));
    }
  },
});

// In-Memory store for fast local caching or when MongoDB is not connected
const inMemoryReports = new Map<string, any>();

// Seed default demo samples
const SEED_SAMPLES = [
  {
    id: 'aud_9f82c1a4',
    createdAt: new Date('2026-11-20T14:30:00.000Z'),
    inputType: 'video',
    inputSummary: '24-second clip claiming new nationwide UPI transaction tax effective tomorrow.',
    isDemoSample: true,
    overallScore: 18,
    verdict: 'FALSE / LIKELY DEEPFAKE',
    executiveSummary: 'No official RBI or Finance Ministry circular supports a UPI transaction tax. Furthermore, the video exhibits severe lip-sync drift and robotic vocal cadence consistent with AI voice cloning.',
    subScores: { claimIntegrity: 10, mediaForensics: 22, provenance: 30 },
    claims: [
      {
        claimText: 'Government announced a 2% tax on all UPI transfers starting tomorrow.',
        status: 'FALSE',
        explanation: 'Official PIB Fact Check and RBI notifications explicitly debunked this recurring rumor.',
        citations: [
          {
            title: 'PIB Fact Check: No tax levied on individual UPI transactions',
            url: 'https://pib.gov.in/factcheck',
            domain: 'pib.gov.in',
          },
        ],
      },
    ],
    forensics: {
      mediaAnalyzed: true,
      synthesisLikelihood: 'HIGH',
      anomalies: [
        {
          category: 'LIP_SYNC_DRIFT',
          severity: 'HIGH',
          timestampOrRegion: '00:04 - 00:19 (mouth & jawline)',
          detail: 'Jaw movement lags behind plosive consonants; unnatural skin smoothing around the lower face.',
        },
      ],
    },
    metadata: {
      fileName: 'urgent_upi_notice.mp4',
      mimeType: 'video/mp4',
      fileSizeBytes: 4120540,
      cameraOrSoftware: 'Lavf58.76.100 (Re-encoded / Stripped EXIF)',
      hasC2PA: false,
      flags: ['Original camera metadata stripped', 'Generic FFmpeg re-encoding signature detected'],
    },
    originTimeline: [
      {
        date: '2023-03-29',
        stage: 'FIRST_SEEN',
        source: 'NPCI Official Circular',
        description: 'Original misconception began around merchant interchange fees (PPI).',
      },
      {
        date: '2026-11-19',
        stage: 'MUTATION',
        source: 'Social Messaging Forwards',
        description: 'Old audio clip re-packaged with an AI-cloned voiceover.',
      },
    ],
  },
  {
    id: 'aud_v391b82',
    createdAt: new Date('2026-11-19T10:15:00.000Z'),
    inputType: 'audio',
    inputSummary: '42-second audio note of Chief Election Commissioner postponing state elections.',
    isDemoSample: true,
    overallScore: 12,
    verdict: 'FALSE / LIKELY DEEPFAKE',
    executiveSummary: 'The audio sample matches known voice synthesis cloning vectors with zero background room reverberation and artificial formant shifts. The Election Commission of India has issued no postponement.',
    subScores: { claimIntegrity: 5, mediaForensics: 15, provenance: 25 },
    claims: [
      {
        claimText: 'State legislative assembly elections postponed indefinitely by ECI order.',
        status: 'FALSE',
        explanation: 'Election Commission of India confirmed current polling schedules stand unchanged without any postponement orders.',
        citations: [
          {
            title: 'Election Commission of India Press Releases & Clarifications',
            url: 'https://eci.gov.in/',
            domain: 'eci.gov.in',
          },
        ],
      },
    ],
    forensics: {
      mediaAnalyzed: true,
      synthesisLikelihood: 'HIGH',
      anomalies: [
        {
          category: 'VOCODER_ARTIFACTS',
          severity: 'HIGH',
          timestampOrRegion: '00:08 - 00:36',
          detail: 'Distinctive metallic vocoder phasing and robotic glottal pulse spacing detected in high frequency bands (above 7.5 kHz).',
        },
      ],
    },
    metadata: {
      fileName: 'eci_urgent_announcement.mp3',
      mimeType: 'audio/mpeg',
      fileSizeBytes: 684200,
      cameraOrSoftware: 'ElevenLabs SpeechSynth / LAME 3.100',
      hasC2PA: false,
      flags: ['AI vocal synthesizer encoder signature detected in frame padding'],
    },
    originTimeline: [
      {
        date: '2026-11-18',
        stage: 'FIRST_SEEN',
        source: 'Encrypted Telegram Group',
        description: 'First uploaded as an anonymous voice message in regional political discussion channels.',
      },
      {
        date: '2026-11-19',
        stage: 'OFFICIAL_RESPONSE',
        source: 'ECI Official Spokesperson',
        description: 'ECI issued a formal clarification and filed an FIR regarding synthetic voice tampering.',
      },
    ],
  },
  {
    id: 'aud_f812a0c',
    createdAt: new Date('2026-11-18T16:45:00.000Z'),
    inputType: 'video',
    inputSummary: '35-second video alleging catastrophic dam collapse in Uttarakhand hills today.',
    isDemoSample: true,
    overallScore: 34,
    verdict: 'MISLEADING / ALTERED',
    executiveSummary: 'Footage is genuine flood video, but represents a serious contextual falsification: reverse-search and visual landmark forensics prove the clip was filmed in Kaziranga, Assam during 2019 monsoons.',
    subScores: { claimIntegrity: 15, mediaForensics: 72, provenance: 18 },
    claims: [
      {
        claimText: 'Major dam breach in Uttarakhand triggering mass evacuations today.',
        status: 'MISLEADING',
        explanation: 'State Disaster Response Force (SDRF) and CWC dam telemetry confirm zero structural failures or breach alerts in Uttarakhand.',
        citations: [
          {
            title: 'Central Water Commission (CWC) Daily Reservoir Level Bulletin',
            url: 'https://cwc.gov.in/',
            domain: 'cwc.gov.in',
          },
        ],
      },
    ],
    forensics: {
      mediaAnalyzed: true,
      synthesisLikelihood: 'LOW',
      anomalies: [
        {
          category: 'SEMANTIC_VISUAL_MISMATCH',
          severity: 'HIGH',
          timestampOrRegion: '00:03 - 00:28 (background terrain & vegetation)',
          detail: 'Vegetation features lowland alluvial flora inconsistent with Himalayan alpine topography claimed in text.',
        },
      ],
    },
    metadata: {
      fileName: 'dam_burst_urgent_alert.mp4',
      mimeType: 'video/mp4',
      fileSizeBytes: 8940120,
      cameraOrSoftware: 'WhatsApp Video Encoder v2.24',
      hasC2PA: false,
      flags: ['EXIF geolocation coordinates stripped by social app'],
    },
    originTimeline: [
      {
        date: '2019-07-16',
        stage: 'FIRST_SEEN',
        source: 'Regional Guwahati News Telecast',
        description: 'Original authentic recording of Brahmaputra water rise in Kaziranga National Park.',
      },
      {
        date: '2026-11-18',
        stage: 'MUTATION',
        source: 'Anonymous Social Account',
        description: 'Reposted with sensationalized geotag "Uttarakhand Tehri overflow".',
      },
    ],
  },
  {
    id: 'aud_isro_99a',
    createdAt: new Date('2026-11-19T09:00:00.000Z'),
    inputType: 'text',
    inputSummary: 'ISRO Chandrayaan-4 lunar sample return mission announcement with 5 modules and LVM3.',
    isDemoSample: true,
    overallScore: 96,
    verdict: 'VERIFIED / AUTHENTIC',
    executiveSummary: 'Claim is corroborated by official Union Cabinet press briefing and official ISRO documentation regarding Chandrayaan-4 mission architecture.',
    subScores: { claimIntegrity: 98, mediaForensics: 100, provenance: 92 },
    claims: [
      {
        claimText: 'Chandrayaan-4 approved with 5 modules and two LVM3 launches.',
        status: 'VERIFIED',
        explanation: 'Union Cabinet approved the mission with fund allocation of Rs 2,104 Crore for lunar sample retrieval.',
        citations: [
          {
            title: 'Cabinet approves Chandrayaan-4 mission',
            url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2056251',
            domain: 'pib.gov.in',
          },
        ],
      },
    ],
    forensics: { mediaAnalyzed: false, synthesisLikelihood: 'NONE', anomalies: [] },
    metadata: {
      fileName: 'text_input.txt',
      mimeType: 'text/plain',
      cameraOrSoftware: 'Official Government Press Release',
      hasC2PA: false,
      flags: ['Direct text submission matching official Gazette records'],
    },
    originTimeline: [
      {
        date: '2024-09-18',
        stage: 'FIRST_SEEN',
        source: 'Press Information Bureau (PIB) New Delhi',
        description: 'Union Cabinet approves Chandrayaan-4 mission architecture.',
      },
    ],
  },
];

for (const sample of SEED_SAMPLES) {
  inMemoryReports.set(sample.id, sample);
}

export async function seedDatabase(): Promise<void> {
  if (!isDbConnected()) return;
  try {
    for (const sample of SEED_SAMPLES) {
      await AuditReportModel.updateOne(
        { id: sample.id },
        { $setOnInsert: sample },
        { upsert: true }
      );
    }
    console.log('✅ Preloaded demo audit reports synchronized to MongoDB Atlas');
  } catch (err) {
    console.warn('Could not sync sample audits to database:', err);
  }
}

// -------------------------------------------------------------
// POST /api/audit/text
// -------------------------------------------------------------
auditRouter.post('/audit/text', async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, sourceUrl } = req.body;
    if (!content || typeof content !== 'string' || !content.trim()) {
      res.status(400).json({ error: 'Text content is required for audit.' });
      return;
    }

    const reportId = `aud_${crypto.randomBytes(4).toString('hex')}`;
    const claimsAnalysis = await analyzeClaimsAndTimeline(content.trim(), sourceUrl);

    const subScores = {
      claimIntegrity: claimsAnalysis.claimIntegrityScore,
      mediaForensics: 100,
      provenance: sourceUrl ? 80 : 50,
    };

    const { overallScore, verdict } = calculateAuthenticityScore('text', true, subScores);

    const reportData = {
      id: reportId,
      createdAt: new Date(),
      inputType: 'text' as InputType,
      inputSummary: content.trim().slice(0, 120) + (content.length > 120 ? '...' : ''),
      isDemoSample: false,
      overallScore,
      verdict,
      executiveSummary: claimsAnalysis.executiveSummary,
      subScores,
      claims: claimsAnalysis.claims,
      forensics: {
        mediaAnalyzed: false,
        synthesisLikelihood: 'NONE' as const,
        anomalies: [],
      },
      metadata: {
        fileName: 'text_claim.txt',
        mimeType: 'text/plain',
        cameraOrSoftware: sourceUrl ? `Source: ${sourceUrl}` : 'Direct user submission',
        hasC2PA: false,
        flags: sourceUrl ? [`External URL verified: ${sourceUrl}`] : ['Unattributed text statement'],
      },
      originTimeline: claimsAnalysis.originTimeline,
    };

    // Persist to MongoDB if connected, else memory store
    if (isDbConnected()) {
      try {
        await AuditReportModel.create(reportData);
      } catch (dbErr) {
        console.warn('MongoDB write error, saving to memory:', dbErr);
        inMemoryReports.set(reportId, reportData);
      }
    } else {
      inMemoryReports.set(reportId, reportData);
    }

    res.status(201).json(reportData);
  } catch (error) {
    console.error('Error in /api/audit/text:', error);
    res.status(500).json({ error: 'Internal audit engine processing error.' });
  }
});

// -------------------------------------------------------------
// POST /api/audit/media
// -------------------------------------------------------------
auditRouter.post(
  '/audit/media',
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const contextClaim = req.body.contextClaim;

      if (!file) {
        res.status(400).json({ error: 'Media file is required.' });
        return;
      }

      const reportId = `aud_${crypto.randomBytes(4).toString('hex')}`;
      const isVideo = file.mimetype.startsWith('video/');
      const isAudio = file.mimetype.startsWith('audio/');
      const inputType: InputType = isVideo ? 'video' : isAudio ? 'audio' : 'image';

      // Run Pillar 3 (Metadata & C2PA parser)
      const { metadata, provenanceScore } = await parseMediaMetadata(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      // Run Pillar 2 (Multimodal Forensics)
      const forensicsResult = await analyzeMediaForensics(
        file.buffer,
        file.mimetype,
        contextClaim
      );

      // Run Pillar 1 & 4 (Claim verification & Timeline) if context claim provided
      let claimsResult: ClaimsAnalysisResult = {
        claims: [],
        originTimeline: [
          {
            date: new Date().toISOString().split('T')[0],
            stage: 'FIRST_SEEN',
            source: file.originalname,
            description: 'Media file uploaded for automated forensics audit.',
          },
        ],
        claimIntegrityScore: 50,
        executiveSummary: 'Media forensics evaluation completed.',
      };

      if (contextClaim && contextClaim.trim()) {
        claimsResult = await analyzeClaimsAndTimeline(contextClaim.trim());
      }

      const subScores = {
        claimIntegrity: claimsResult.claimIntegrityScore,
        mediaForensics: forensicsResult.mediaForensicScore,
        provenance: provenanceScore,
      };

      const hasClaim = Boolean(contextClaim && contextClaim.trim());
      const { overallScore, verdict } = calculateAuthenticityScore(
        inputType,
        hasClaim,
        subScores
      );

      const executiveSummary =
        forensicsResult.forensics.synthesisLikelihood === 'HIGH'
          ? 'Deepfake forensics identified critical neural synthesis artifacts in the media stream.'
          : claimsResult.executiveSummary;

      const reportData = {
        id: reportId,
        createdAt: new Date(),
        inputType,
        inputSummary: `${file.originalname} (${(file.size / (1024 * 1024)).toFixed(2)} MB)${
          contextClaim ? ` - "${contextClaim}"` : ''
        }`,
        isDemoSample: false,
        overallScore,
        verdict,
        executiveSummary,
        subScores,
        claims: claimsResult.claims,
        forensics: forensicsResult.forensics,
        metadata,
        originTimeline: claimsResult.originTimeline,
      };

      // Storage note: Raw buffer is NOT saved, only metadata and audit findings are persisted
      if (isDbConnected()) {
        try {
          await AuditReportModel.create(reportData);
        } catch (dbErr) {
          console.warn('MongoDB write error, saving to memory:', dbErr);
          inMemoryReports.set(reportId, reportData);
        }
      } else {
        inMemoryReports.set(reportId, reportData);
      }

      res.status(201).json(reportData);
    } catch (error) {
      console.error('Error in /api/audit/media:', error);
      res.status(500).json({ error: 'Internal media forensics pipeline error.' });
    }
  }
);

// -------------------------------------------------------------
// GET /api/audit/:id
// -------------------------------------------------------------
auditRouter.get('/audit/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const doc = await AuditReportModel.findOne({ id }).lean();
      if (doc) {
        res.json(doc);
        return;
      }
    }

    // Check memory store
    const memDoc = inMemoryReports.get(id);
    if (memDoc) {
      res.json(memDoc);
      return;
    }

    res.status(404).json({ error: `Audit report '${id}' not found.` });
  } catch (error) {
    console.error('Error fetching audit report:', error);
    res.status(500).json({ error: 'Failed to retrieve audit report.' });
  }
});

// -------------------------------------------------------------
// GET /api/audits/feed
// -------------------------------------------------------------
auditRouter.get('/audits/feed', async (req: Request, res: Response): Promise<void> => {
  try {
    const filter = (req.query.filter as string) || 'all';
    const limit = parseInt((req.query.limit as string) || '20', 10);

    let results: any[] = [];

    if (isDbConnected()) {
      let query: any = {};
      if (filter === 'false') {
        query.overallScore = { $lt: 25 };
      } else if (filter === 'verified') {
        query.overallScore = { $gte: 80 };
      } else if (filter === 'context') {
        query.overallScore = { $gte: 25, $lt: 80 };
      }

      results = await AuditReportModel.find(query)
        .sort({ isDemoSample: -1, createdAt: -1 })
        .limit(limit)
        .lean();
    }

    // If results is empty or DB not connected, use memory store
    if (results.length === 0) {
      const allMem = Array.from(inMemoryReports.values());
      results = allMem.filter((item) => {
        if (filter === 'false') return item.overallScore < 25;
        if (filter === 'verified') return item.overallScore >= 80;
        if (filter === 'context') return item.overallScore >= 25 && item.overallScore < 80;
        return true;
      });
    }

    res.json(results);
  } catch (error) {
    console.error('Error in /api/audits/feed:', error);
    res.status(500).json({ error: 'Failed to retrieve verification stream.' });
  }
});

// -------------------------------------------------------------
// GET /api/health
// -------------------------------------------------------------
auditRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? 'connected' : 'in-memory-fallback',
    geminiConfigured: isGeminiConfigured(),
  });
});
