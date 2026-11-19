import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';
import { SubScores, VerdictTier } from '../types/audit';

interface ScoreGaugeProps {
  score: number;
  verdict: VerdictTier;
  subScores?: SubScores;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, verdict, subScores }) => {
  // Determine color palette based on specs.md Section 4.2
  let strokeClass = 'stroke-rose-500';
  let bgGlow = 'from-rose-500/10 to-transparent';
  let badgeClass = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  let Icon = AlertOctagon;

  if (score >= 80) {
    strokeClass = 'stroke-emerald-400';
    bgGlow = 'from-emerald-500/10 to-transparent';
    badgeClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    Icon = ShieldCheck;
  } else if (score >= 50) {
    strokeClass = 'stroke-amber-400';
    bgGlow = 'from-amber-500/10 to-transparent';
    badgeClass = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    Icon = HelpCircle;
  } else if (score >= 25) {
    strokeClass = 'stroke-orange-400';
    bgGlow = 'from-orange-500/10 to-transparent';
    badgeClass = 'bg-orange-500/15 text-orange-300 border-orange-500/30';
    Icon = AlertTriangle;
  }

  // SVG Gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative p-6 rounded-2xl bg-gradient-to-b ${bgGlow} bg-[#101728] border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-6`}>
      {/* Radial SVG Gauge */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 140 140">
          {/* Track Circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Value Arc */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            className={`${strokeClass} transition-all duration-1000 ease-out`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
            {score}
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            Out of 100
          </span>
        </div>
      </div>

      {/* Verdict & Subscores */}
      <div className="flex-1 w-full text-center md:text-left">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold tracking-wide mb-2 uppercase shadow-sm ${badgeClass}`}>
          <Icon className="w-4 h-4" />
          <span>{verdict}</span>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Calculated by weighted multimodal integrity synthesis across factual citations, forensic anomalies, and file provenance.
        </p>

        {/* Sub-Score Bars */}
        {subScores && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Claim Accuracy</span>
                <span className="font-mono font-bold text-slate-200">{subScores.claimIntegrity}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${subScores.claimIntegrity}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Media Forensics</span>
                <span className="font-mono font-bold text-slate-200">{subScores.mediaForensics}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${subScores.mediaForensics}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Provenance / EXIF</span>
                <span className="font-mono font-bold text-slate-200">{subScores.provenance}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400 rounded-full transition-all duration-700"
                  style={{ width: `${subScores.provenance}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
