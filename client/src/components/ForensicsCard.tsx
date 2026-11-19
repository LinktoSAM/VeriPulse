import React from 'react';
import { ScanFace, AlertTriangle, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { ForensicsData, SeverityLevel } from '../types/audit';

interface ForensicsCardProps {
  forensics: ForensicsData;
}

export const ForensicsCard: React.FC<ForensicsCardProps> = ({ forensics }) => {
  const getLikelihoodBadge = (likelihood: string) => {
    switch (likelihood) {
      case 'HIGH':
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          text: 'HIGH PROBABILITY OF AI SYNTHESIS',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          text: 'SUSPECTED LOCALIZED MANIPULATION',
        };
      case 'LOW':
        return {
          bg: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
          text: 'LOW SYNTHESIS RISK',
        };
      default:
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          text: 'NO SYNTHESIS DETECTED',
        };
    }
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'HIGH':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    }
  };

  const likelihoodBadge = getLikelihoodBadge(forensics.synthesisLikelihood);

  return (
    <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ScanFace className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pillar 2: Multimodal Forensics
            </h3>
            <p className="text-[11px] text-slate-400">
              Facial boundaries, acoustic cadence & semantic-visual coherence
            </p>
          </div>
        </div>
      </div>

      {/* Synthesis Likelihood Banner */}
      <div className={`p-3 rounded-xl border mb-4 flex items-center justify-between ${likelihoodBadge.bg}`}>
        <div className="flex items-center gap-2">
          {forensics.synthesisLikelihood === 'HIGH' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : forensics.synthesisLikelihood === 'NONE' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-xs font-bold tracking-wide">
            {likelihoodBadge.text}
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/30">
          Likelihood: {forensics.synthesisLikelihood}
        </span>
      </div>

      {/* Anomalies List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {forensics.anomalies.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
            No audio-visual synthesis or artifact anomalies identified in media inspection.
          </div>
        ) : (
          forensics.anomalies.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {item.category.replace(/_/g, ' ')}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(
                    item.severity
                  )}`}
                >
                  {item.severity} SEVERITY
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                {item.detail}
              </p>

              {item.timestampOrRegion && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-950/60 px-2 py-1 rounded w-fit border border-slate-800">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Region: {item.timestampOrRegion}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

