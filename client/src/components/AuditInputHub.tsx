import React, { useState, useRef } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  UploadCloud,
  Sparkles,
  AlertCircle,
  FileCheck,
  X,
  Search,
} from 'lucide-react';
import { InputType, DemoSampleTrigger } from '../types/audit';
import { DEMO_TRIGGERS } from '../data/demoData';

interface AuditInputHubProps {
  onSubmitText: (content: string, sourceUrl?: string) => void;
  onSubmitMedia: (file: File, contextClaim?: string) => void;
  onSelectDemo: (trigger: DemoSampleTrigger) => void;
  isLoading: boolean;
}

export const AuditInputHub: React.FC<AuditInputHubProps> = ({
  onSubmitText,
  onSubmitMedia,
  onSelectDemo,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<InputType>('text');
  const [textContent, setTextContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contextClaim, setContextClaim] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats: Record<InputType, string> = {
    text: '',
    image: 'image/jpeg,image/png,image/webp',
    audio: 'audio/mpeg,audio/wav,audio/ogg',
    video: 'video/mp4,video/quicktime,video/webm',
  };

  const handleTabChange = (tab: InputType) => {
    setActiveTab(tab);
    setValidationError(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setValidationError(null);
    const maxBytes = 25 * 1024 * 1024; // 25 MB max
    if (file.size > maxBytes) {
      setValidationError('File size exceeds the 25 MB limit specified for real-time audits.');
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (activeTab === 'text') {
      if (!textContent.trim()) {
        setValidationError('Please enter a claim statement, forward text, or news description.');
        return;
      }
      onSubmitText(textContent.trim(), sourceUrl.trim() || undefined);
    } else {
      if (!selectedFile) {
        setValidationError(`Please upload a ${activeTab} file to proceed.`);
        return;
      }
      onSubmitMedia(selectedFile, contextClaim.trim() || undefined);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Civic Misinformation & Synthetic Media Audit</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Verify Before You <span className="text-emerald-400">Forward.</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Audit suspicious text claims, forwarded voice notes, manipulated photos, and viral clips across live PIB/RBI records and deepfake forensics.
        </p>
      </div>

      {/* "Try an Example" One-Click Chips */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Try an Example (Instant Judge Demo):
          </span>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Click to simulate full 4-pillar analysis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {DEMO_TRIGGERS.map((trigger) => (
            <button
              key={trigger.id}
              onClick={() => onSelectDemo(trigger)}
              disabled={isLoading}
              className="text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {trigger.badge}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  {trigger.type}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
                {trigger.title}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                {trigger.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Hub Container */}
      <div className="rounded-2xl bg-[#101728] border border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* 4 Modality Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Text / Claim</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image Audit</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('audio')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'audio'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Audio Voice Note</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Clip</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'text' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Suspicious Claim, Forwarded Message, or Rumor
                </label>
                <textarea
                  rows={4}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste WhatsApp forward, tweet text, or rumor (e.g., 'Government announced a 2% tax on UPI transfers starting tomorrow...')"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Source or Reference URL <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://x.com/... or https://news-source.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : selectedFile
                    ? 'border-emerald-500/50 bg-slate-900/80'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptedFormats[activeTab]}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-slate-200">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Binary media'}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="mt-2 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-slate-200">
                      Drag and drop your {activeTab} file here, or <span className="text-emerald-400">browse</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Supports JPG, PNG, WEBP, MP3, WAV, MP4 up to 25 MB
                    </div>
                  </div>
                )}
              </div>

              {/* Optional context claim */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Context or Accompanying Forwarded Caption <span className="text-slate-500 font-normal">(Recommended)</span>
                </label>
                <input
                  type="text"
                  value={contextClaim}
                  onChange={(e) => setContextClaim(e.target.value)}
                  placeholder="e.g. 'Forwarded claiming this shows dam breach in Uttarakhand today'"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Run Multi-Pillar Verification Audit</span>
          </button>
        </form>
      </div>
    </div>
  );
};

