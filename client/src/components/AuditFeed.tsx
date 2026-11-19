import React, { useState, useEffect } from 'react';
import { Radio, Filter, ArrowRight, ShieldCheck, AlertOctagon, AlertTriangle, FileText, Video, Mic, Image as ImageIcon } from 'lucide-react';
import { AuditReport } from '../types/audit';
import { getAuditFeed } from '../services/api';

interface AuditFeedProps {
  onSelectReport: (report: AuditReport) => void;
}

export const AuditFeed: React.FC<AuditFeedProps> = ({ onSelectReport }) => {
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [filter, setFilter] = useState<'all' | 'false' | 'verified' | 'context'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAuditFeed(filter)
      .then((data) => {
        if (isMounted) {
          setReports(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load feed:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-3.5 h-3.5 text-rose-400" />;
      case 'audio':
        return <Mic className="w-3.5 h-3.5 text-amber-400" />;
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          {score}/100 Verified
        </span>
      );
    }
    if (score >= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          {score}/100 Needs Context
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
        <AlertOctagon className="w-3.5 h-3.5" />
        {score}/100 False / Deepfake
      </span>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101728] border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Public Verification Stream</h2>
            <p className="text-xs text-slate-400">
              Recent civic claims and forwarded media audited by the VeriPulse community
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Audits
          </button>
          <button
            onClick={() => setFilter('false')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'false'
                ? 'bg-rose-500/20 text-rose-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            False / Deepfakes
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'verified'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Verified Authentic
          </button>
          <button
            onClick={() => setFilter('context')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'context'
                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Needs Context
          </button>
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
          Loading live verification feed...
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
          No audits found matching this filter category.
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectReport(item)}
              className="p-5 rounded-xl bg-[#101728] hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all shadow-md group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-md bg-slate-900 border border-slate-800">
                    {getTypeIcon(item.inputType)}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    {item.inputType} Audit
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {item.isDemoSample && (
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Curated Sample
                    </span>
                  )}
                </div>

                {getScoreBadge(item.overallScore)}
              </div>

              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors mb-2">
                {item.inputSummary}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                {item.executiveSummary}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                  <span>Claims checked: <strong className="text-slate-300">{item.claims.length}</strong></span>
                  <span>Forensic anomalies: <strong className="text-slate-300">{item.forensics.anomalies.length}</strong></span>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>View Full Trust Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

