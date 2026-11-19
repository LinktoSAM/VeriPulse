import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ExternalLink, Globe } from 'lucide-react';
import { Claim, ClaimStatus } from '../types/audit';

interface EvidenceCardProps {
  claims: Claim[];
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ claims }) => {
  const getBadgeStyle = (status: ClaimStatus) => {
    switch (status) {
      case 'VERIFIED':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          label: 'VERIFIED',
        };
      case 'FALSE':
        return {
          icon: XCircle,
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          label: 'FALSE',
        };
      case 'MISLEADING':
        return {
          icon: AlertTriangle,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          label: 'MISLEADING',
        };
      default:
        return {
          icon: HelpCircle,
          color: 'text-slate-400 bg-slate-800 border-slate-700',
          label: 'UNVERIFIED',
        };
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pillar 1: Fact-Check Evidence
            </h3>
            <p className="text-[11px] text-slate-400">
              Grounded cross-verification with authoritative databases
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          {claims.length} {claims.length === 1 ? 'Claim' : 'Claims'}
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {claims.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No discrete factual claims extracted from input.
          </p>
        ) : (
          claims.map((claim, idx) => {
            const badge = getBadgeStyle(claim.status);
            const StatusIcon = badge.icon;

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      #{idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Claim Statement */}
                <blockquote className="text-xs font-medium text-slate-200 pl-3 border-l-2 border-emerald-500/40 my-2 italic">
                  "{claim.claimText}"
                </blockquote>

                {/* Explanation */}
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {claim.explanation}
                </p>

                {/* Grounded Source Citations */}
                {claim.citations && claim.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">
                      Corroborated Official Sources:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {claim.citations.map((cite, cIdx) => (
                        <a
                          key={cIdx}
                          href={cite.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 border border-slate-700 hover:border-emerald-500/40 transition-colors"
                        >
                          <span className="truncate max-w-[200px]">{cite.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({cite.domain})</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

