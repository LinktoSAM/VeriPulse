import mongoose, { Schema, Document } from 'mongoose';

export type InputType = 'text' | 'image' | 'audio' | 'video';

export type ClaimStatus = 'VERIFIED' | 'MISLEADING' | 'FALSE' | 'UNVERIFIED';

export type VerdictTier =
  | 'VERIFIED / AUTHENTIC'
  | 'NEEDS CONTEXT / INCONCLUSIVE'
  | 'MISLEADING / ALTERED'
  | 'FALSE / LIKELY DEEPFAKE';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ICitation {
  title: string;
  url: string;
  domain: string;
}

export interface IClaim {
  claimText: string;
  status: ClaimStatus;
  explanation: string;
  citations: ICitation[];
}

export interface IForensicAnomaly {
  category: string;
  severity: SeverityLevel;
  timestampOrRegion: string;
  detail: string;
}

export interface IForensicsData {
  mediaAnalyzed: boolean;
  synthesisLikelihood: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  anomalies: IForensicAnomaly[];
}

export interface IMetadataSummary {
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  cameraOrSoftware?: string;
  hasC2PA?: boolean;
  flags?: string[];
  exifDetails?: Record<string, unknown>;
}

export interface ITimelineNode {
  date: string;
  stage: string;
  source: string;
  description: string;
}

export interface ISubScores {
  claimIntegrity: number;
  mediaForensics: number;
  provenance: number;
}

export interface IAuditReport extends Document {
  id: string;
  createdAt: Date;
  inputType: InputType;
  inputSummary: string;
  isDemoSample?: boolean;
  overallScore: number;
  verdict: VerdictTier;
  executiveSummary: string;
  subScores: ISubScores;
  claims: IClaim[];
  forensics: IForensicsData;
  metadata: IMetadataSummary;
  originTimeline: ITimelineNode[];
}

const CitationSchema = new Schema<ICitation>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    domain: { type: String, required: true },
  },
  { _id: false }
);

const ClaimSchema = new Schema<IClaim>(
  {
    claimText: { type: String, required: true },
    status: {
      type: String,
      enum: ['VERIFIED', 'MISLEADING', 'FALSE', 'UNVERIFIED'],
      required: true,
    },
    explanation: { type: String, required: true },
    citations: [CitationSchema],
  },
  { _id: false }
);

const AnomalySchema = new Schema<IForensicAnomaly>(
  {
    category: { type: String, required: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
    timestampOrRegion: { type: String, default: '' },
    detail: { type: String, required: true },
  },
  { _id: false }
);

const ForensicsSchema = new Schema<IForensicsData>(
  {
    mediaAnalyzed: { type: Boolean, default: false },
    synthesisLikelihood: {
      type: String,
      enum: ['NONE', 'LOW', 'MEDIUM', 'HIGH'],
      default: 'NONE',
    },
    anomalies: [AnomalySchema],
  },
  { _id: false }
);

const MetadataSchema = new Schema<IMetadataSummary>(
  {
    fileName: String,
    mimeType: String,
    fileSizeBytes: Number,
    cameraOrSoftware: String,
    hasC2PA: { type: Boolean, default: false },
    flags: [String],
    exifDetails: Schema.Types.Mixed,
  },
  { _id: false }
);

const TimelineSchema = new Schema<ITimelineNode>(
  {
    date: { type: String, required: true },
    stage: { type: String, required: true },
    source: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const SubScoresSchema = new Schema<ISubScores>(
  {
    claimIntegrity: { type: Number, required: true },
    mediaForensics: { type: Number, required: true },
    provenance: { type: Number, required: true },
  },
  { _id: false }
);

const AuditReportSchema = new Schema<IAuditReport>(
  {
    id: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    inputType: {
      type: String,
      enum: ['text', 'image', 'audio', 'video'],
      required: true,
    },
    inputSummary: { type: String, required: true },
    isDemoSample: { type: Boolean, default: false },
    overallScore: { type: Number, required: true },
    verdict: {
      type: String,
      enum: [
        'VERIFIED / AUTHENTIC',
        'NEEDS CONTEXT / INCONCLUSIVE',
        'MISLEADING / ALTERED',
        'FALSE / LIKELY DEEPFAKE',
      ],
      required: true,
    },
    executiveSummary: { type: String, required: true },
    subScores: { type: SubScoresSchema, required: true },
    claims: [ClaimSchema],
    forensics: { type: ForensicsSchema, required: true },
    metadata: { type: MetadataSchema, required: true },
    originTimeline: [TimelineSchema],
  },
  {
    collection: 'audit_reports',
    timestamps: false,
  }
);

// Indexes specified in specs.md Section 6
AuditReportSchema.index({ createdAt: -1 });
AuditReportSchema.index({ isDemoSample: -1, createdAt: -1 });

export const AuditReportModel = mongoose.model<IAuditReport>(
  'AuditReport',
  AuditReportSchema
);
