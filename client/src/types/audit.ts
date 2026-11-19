export type InputType = 'text' | 'image' | 'audio' | 'video';

export type ClaimStatus = 'VERIFIED' | 'MISLEADING' | 'FALSE' | 'UNVERIFIED';

export type VerdictTier =
  | 'VERIFIED / AUTHENTIC'
  | 'NEEDS CONTEXT / INCONCLUSIVE'
  | 'MISLEADING / ALTERED'
  | 'FALSE / LIKELY DEEPFAKE';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Citation {
  title: string;
  url: string;
  domain: string;
}

export interface Claim {
  claimText: string;
  status: ClaimStatus;
  explanation: string;
  citations: Citation[];
}

export interface ForensicAnomaly {
  category: string;
  severity: SeverityLevel;
  timestampOrRegion: string;
  detail: string;
}

export interface ForensicsData {
  mediaAnalyzed: boolean;
  synthesisLikelihood: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  anomalies: ForensicAnomaly[];
}

export interface MetadataSummary {
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  cameraOrSoftware?: string;
  hasC2PA?: boolean;
  flags?: string[];
  exifDetails?: Record<string, unknown>;
}

export interface TimelineNode {
  date: string;
  stage: 'FIRST_SEEN' | 'MUTATION' | 'VIRAL_SPREAD' | 'OFFICIAL_RESPONSE' | 'DEBUNKED' | string;
  source: string;
  description: string;
}

export interface SubScores {
  claimIntegrity: number;
  mediaForensics: number;
  provenance: number;
}

export interface AuditReport {
  id: string;
  createdAt: string;
  inputType: InputType;
  inputSummary: string;
  isDemoSample?: boolean;
  overallScore: number;
  verdict: VerdictTier;
  executiveSummary: string;
  subScores: SubScores;
  claims: Claim[];
  forensics: ForensicsData;
  metadata: MetadataSummary;
  originTimeline: TimelineNode[];
}

export interface DemoSampleTrigger {
  id: string;
  title: string;
  badge: string;
  type: InputType;
  description: string;
  sampleInput: string;
  contextClaim?: string;
}

