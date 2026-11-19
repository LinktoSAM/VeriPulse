import React from 'react';
import { ShieldCheck, ExternalLink, Cpu, FileSearch, Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090D15] text-slate-400 py-10 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-slate-200 text-base">VeriPulse Engine</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Real-time multimodal fact-checking, synthetic media detection, and metadata provenance audit for high-velocity civic information integrity.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              IDEA//FORGE Online Hackathon (Challazo) • Track 1
            </div>
          </div>

          {/* Col 2: Third-Party Attribution (Required for Challazo) */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Third-Party Attribution & Technology Stack
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-200 font-medium mb-1">
                  <span className="flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                    Google Gemini 2.5 Flash
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Core AI</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Powers multimodal acoustic/visual deepfake forensics and real-time Search Grounding against official government registries and news archives.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-200 font-medium mb-1">
                  <span className="flex items-center gap-1.5">
                    <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
                    exifr & FFmpeg / ffprobe
                  </span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">Forensics</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Extracts EXIF, XMP, IPTC metadata, encoder signatures (e.g. ElevenLabs, Firefly), and identifies C2PA Content Credentials.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            VeriPulse v1.0 • Built for Citizens, Moderators & Civic Journalists.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              All systems operational
            </span>
            <a 
              href="https://pib.gov.in/factcheck" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
            >
              PIB Fact Check <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

