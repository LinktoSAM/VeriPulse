import React, { useState } from 'react';
import {
  Share2,
  Check,
  RotateCcw,
  Download,
  AlertCircle,
  FileText,
  ScanFace,
  FileCode,
  GitBranch,
  Layers,
} from 'lucide-react';
import { AuditReport } from '../types/audit';
import { ScoreGauge } from './ScoreGauge';
import { EvidenceCard } from './EvidenceCard';
import { ForensicsCard } from './ForensicsCard';
import { MetadataCard } from './MetadataCard';
import { TimelineCard } from './TimelineCard';

interface TrustReportViewProps {
  report: AuditReport;
  onReset: () => void;
}

export const TrustReportView: React.FC<TrustReportViewProps> = ({ report, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'claims' | 'forensics' | 'metadata' | 'timeline'>('all');

  const handleCopyLink = () => {
    const url = `${window.location.origin}?report=${report.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `veripulse_report_${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Audit Another Claim
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-mono text-slate-400">
            ID: <span className="text-emerald-400">{report.id}</span>
          </span>
          {report.isDemoSample && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Demo Sample
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            title="Download full canonical report JSON"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Link!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Share Report Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Banner: Score Gauge & Executive Summary */}
      <ScoreGauge
        score={report.overallScore}
        verdict={report.verdict}
        subScores={report.subScores}
      />

      {/* Input Summary & Executive Overview */}
      <div className="p-5 rounded-2xl bg-[#101728] border border-slate-800 space-y-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
            Input Claim / Media Analyzed:
          </span>
          <p className="text-sm font-medium text-slate-200 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
            {report.inputSummary}
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Executive Audit Verdict:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
            {report.executiveSummary}
          </p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All 4 Pillars Grid
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'claims'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Claims ({report.claims.length})
          </button>
          <button
            onClick={() => setActiveTab('forensics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'forensics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScanFace className="w-3.5 h-3.5" />
            Forensics ({report.forensics.anomalies.length})
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'metadata'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Metadata & C2PA
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'timeline'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Origin Timeline ({report.originTimeline.length})
          </button>
        </div>
      </div>

      {/* 4-Pillar Content Display */}
      {activeTab === 'all' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EvidenceCard claims={report.claims} />
          <ForensicsCard forensics={report.forensics} />
          <MetadataCard metadata={report.metadata} />
          <TimelineCard timeline={report.originTimeline} />
        </div>
      ) : activeTab === 'claims' ? (
        <EvidenceCard claims={report.claims} />
      ) : activeTab === 'forensics' ? (
        <ForensicsCard forensics={report.forensics} />
      ) : activeTab === 'metadata' ? (
        <MetadataCard metadata={report.metadata} />
      ) : (
        <TimelineCard timeline={report.originTimeline} />
      )}
    </div>
  );
};

