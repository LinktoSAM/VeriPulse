import React from 'react';
import { GitBranch, Calendar, MapPin } from 'lucide-react';
import { TimelineNode } from '../types/audit';

interface TimelineCardProps {
  timeline: TimelineNode[];
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ timeline }) => {
  const getStageStyle = (stage: string) => {
    switch (stage) {
      case 'FIRST_SEEN':
        return {
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
          dot: 'bg-blue-400 ring-blue-500/30',
          label: 'ORIGIN / FIRST APPEARANCE',
        };
      case 'MUTATION':
        return {
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          dot: 'bg-amber-400 ring-amber-500/30',
          label: 'CONTEXT SHIFT / MUTATION',
        };
      case 'VIRAL_SPREAD':
        return {
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          dot: 'bg-rose-400 ring-rose-500/30',
          label: 'VIRAL RESURGENCE',
        };
      case 'OFFICIAL_RESPONSE':
      case 'DEBUNKED':
        return {
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          dot: 'bg-emerald-400 ring-emerald-500/30',
          label: 'OFFICIAL FACT-CHECK / RESPONSE',
        };
      default:
        return {
          color: 'text-slate-400 bg-slate-800 border-slate-700',
          dot: 'bg-slate-400 ring-slate-700',
          label: stage.replace(/_/g, ' '),
        };
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pillar 4: Origin & Spread Timeline
            </h3>
            <p className="text-[11px] text-slate-400">
              Chronological emergence and narrative mutation trajectory
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          {timeline.length} Milestones
        </span>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="relative pl-6 space-y-6 flex-1 overflow-y-auto before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {timeline.map((item, idx) => {
          const style = getStageStyle(item.stage);

          return (
            <div key={idx} className="relative group">
              {/* Stepper Node Bullet */}
              <div
                className={`absolute -left-6 top-1 w-3 h-3 rounded-full ring-4 ${style.dot} transition-transform group-hover:scale-125`}
              />

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${style.color}`}
                  >
                    {style.label}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-1">
                  <MapPin className="w-3 h-3 text-teal-400" />
                  <span>Platform / Source: {item.source}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

