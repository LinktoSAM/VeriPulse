import React from 'react';
import { FileCode, ShieldAlert, ShieldCheck, FileCheck, Info } from 'lucide-react';
import { MetadataSummary } from '../types/audit';

interface MetadataCardProps {
  metadata: MetadataSummary;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({ metadata }) => {
  return (
    <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pillar 3: Metadata & Provenance
            </h3>
            <p className="text-[11px] text-slate-400">
              EXIF/XMP parsing, encoder tags & C2PA credentials audit
            </p>
          </div>
        </div>
      </div>

      {/* C2PA Content Credentials Status */}
      <div className="mb-4">
        <div
          className={`p-3 rounded-xl border flex items-center justify-between ${
            metadata.hasC2PA
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {metadata.hasC2PA ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-xs font-bold">
              {metadata.hasC2PA
                ? 'C2PA Content Credentials Verified'
                : 'No C2PA Content Credentials Found'}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30">
            {metadata.hasC2PA ? 'Signed JUMBF' : 'Unsigned Media'}
          </span>
        </div>
      </div>

      {/* Technical Header Summary */}
      <div className="space-y-2 mb-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
        {metadata.fileName && (
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">File Name:</span>
            <span className="font-mono text-slate-200 truncate max-w-[200px]">
              {metadata.fileName}
            </span>
          </div>
        )}
        {metadata.mimeType && (
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">MIME Format:</span>
            <span className="font-mono text-slate-200">{metadata.mimeType}</span>
          </div>
        )}
        {metadata.fileSizeBytes && (
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">File Size:</span>
            <span className="font-mono text-slate-200">
              {(metadata.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        )}
        {metadata.cameraOrSoftware && (
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Software / Encoder:</span>
            <span className="font-mono text-indigo-300 font-semibold truncate max-w-[220px]">
              {metadata.cameraOrSoftware}
            </span>
          </div>
        )}
      </div>

      {/* Provenance Flags */}
      <div className="flex-1">
        <span className="text-[11px] uppercase font-semibold text-slate-400 block mb-2">
          Provenance Integrity Flags:
        </span>
        <div className="space-y-1.5">
          {metadata.flags && metadata.flags.length > 0 ? (
            metadata.flags.map((flag, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-300"
              >
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Full authentic camera metadata intact; no stripping detected.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

