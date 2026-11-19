import React, { useEffect, useState } from 'react';
import { FileSearch, Globe2, ScanFace, GitBranch, CheckCircle2, Loader2 } from 'lucide-react';

interface ProgressStepperProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const STEPS = [
  {
    id: 1,
    title: 'Pillar 3 & Extraction',
    label: 'Extracting claims & parsing file metadata...',
    detail: 'Inspecting EXIF/C2PA headers, codecs, and discrete factual assertions',
    icon: FileSearch,
  },
  {
    id: 2,
    title: 'Pillar 1: Search Grounding',
    label: 'Cross-referencing live web & official sources...',
    detail: 'Gemini Search Grounding querying PIB, RBI, Government circulars & registries',
    icon: Globe2,
  },
  {
    id: 3,
    title: 'Pillar 2: Multimodal Forensics',
    label: 'Running multimodal deepfake forensics...',
    detail: 'Analyzing lip-sync drift, acoustic vocoder artifacts, and contextual mismatches',
    icon: ScanFace,
  },
  {
    id: 4,
    title: 'Pillar 4 & Synthesis',
    label: 'Reconstructing origin timeline & Trust Score...',
    detail: 'Tracing narrative lineage and computing weighted composite authenticity rating',
    icon: GitBranch,
  },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ isLoading }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(1);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-6 rounded-2xl bg-[#101726]/90 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              VeriPulse Multi-Pillar Pipeline Running
            </h3>
            <p className="text-xs text-slate-400">
              Synchronizing claim extraction, multimodal inspection, and live web grounding
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
          Step {currentStep} of 4
        </span>
      </div>

      <div className="space-y-4">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-4 ${
                isCurrent
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-100 shadow-md shadow-emerald-500/5'
                  : isDone
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                  : 'bg-slate-900/20 border-slate-900 text-slate-600'
              }`}
            >
              <div
                className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-emerald-500 text-slate-950 animate-pulse'
                    : 'bg-slate-800 text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <StepIcon className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-emerald-300' : isDone ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
                    {step.title}
                  </span>
                </div>
                <p
                  className={`text-xs ${
                    isCurrent ? 'text-slate-300' : isDone ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

