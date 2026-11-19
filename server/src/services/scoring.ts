import { InputType, VerdictTier, ISubScores } from '../models/AuditReport.js';

export function calculateAuthenticityScore(
  inputType: InputType,
  hasClaim: boolean,
  subScores: ISubScores
): { overallScore: number; verdict: VerdictTier } {
  let score = 0;

  const clamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));

  const sClaim = clamp(subScores.claimIntegrity);
  const sMedia = clamp(subScores.mediaForensics);
  const sProv = clamp(subScores.provenance);

  if (inputType === 'text') {
    // Text / URL Only Input: 0.85 * S_claim + 0.15 * S_prov
    score = Math.round(0.85 * sClaim + 0.15 * sProv);
  } else if (hasClaim) {
    // Multimodal Input (Media + Claim): 0.45 * S_claim + 0.40 * S_media + 0.15 * S_prov
    score = Math.round(0.45 * sClaim + 0.40 * sMedia + 0.15 * sProv);
  } else {
    // Pure Media Input (No verifiable claim): 0.75 * S_media + 0.25 * S_prov
    score = Math.round(0.75 * sMedia + 0.25 * sProv);
  }

  score = clamp(score);

  let verdict: VerdictTier = 'FALSE / LIKELY DEEPFAKE';
  if (score >= 80) {
    verdict = 'VERIFIED / AUTHENTIC';
  } else if (score >= 50) {
    verdict = 'NEEDS CONTEXT / INCONCLUSIVE';
  } else if (score >= 25) {
    verdict = 'MISLEADING / ALTERED';
  } else {
    verdict = 'FALSE / LIKELY DEEPFAKE';
  }

  return { overallScore: score, verdict };
}
