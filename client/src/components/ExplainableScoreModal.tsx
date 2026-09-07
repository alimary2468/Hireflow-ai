import React from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, HelpCircle, FileText, Info } from 'lucide-react';
import { ScreeningResult, Candidate } from '../types';

interface ExplainableScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  screening: ScreeningResult;
  candidate?: Candidate;
}

export const ExplainableScoreModal: React.FC<ExplainableScoreModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  screening,
  candidate,
}) => {
  if (!isOpen) return null;

  const categories = [
    { label: 'Skills Match', score: screening.skillsScore, max: 40, weight: '40%', color: 'bg-blue-500' },
    { label: 'Experience & Seniority', score: screening.experienceScore, max: 25, weight: '25%', color: 'bg-indigo-500' },
    { label: 'Education Relevancy', score: screening.educationScore, max: 10, weight: '10%', color: 'bg-purple-500' },
    { label: 'Project Demonstration', score: screening.projectScore, max: 15, weight: '15%', color: 'bg-cyan-500' },
    { label: 'Certifications & Merits', score: screening.qualificationScore, max: 10, weight: '10%', color: 'bg-emerald-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Explainable AI Transparency Engine
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Why did {candidateName} score {screening.overallScore} / 100?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Rubric Breakdown Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              100-Point Scoring Rubric Breakdown
            </h4>
            <div className="space-y-3">
              {categories.map((cat) => {
                const pct = Math.round((cat.score / cat.max) * 100);
                return (
                  <div key={cat.label} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-200">{cat.label} <span className="text-[10px] text-slate-400">({cat.weight} weight)</span></span>
                      <span className="text-white font-mono">{cat.score} / {cat.max} <span className="text-[11px] text-slate-400">({pct}%)</span></span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div className={`h-full ${cat.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}

              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-sm font-extrabold text-white">
                <span>TOTAL CANDIDATE SCORE</span>
                <span className="text-xl text-blue-400 font-mono">{screening.overallScore} / 100</span>
              </div>
            </div>
          </div>

          {/* Evidence Logs */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" /> Grounded Evidence & Keyword Matching
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700">
                <span className="font-semibold text-emerald-400 block mb-1">Matched Skills & Verification:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {screening.matchingSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" /> {s}
                    </span>
                  ))}
                </div>
              </div>

              {screening.missingRequirements.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700">
                  <span className="font-semibold text-amber-400 block mb-1">Missing Requirements / Evidence Gaps:</span>
                  <ul className="space-y-1 text-slate-300">
                    {screening.missingRequirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Responsible AI Disclaimer:</strong> AI recommendations are decision-support tools based on explicit CV text evidence. Protected traits (gender, race, age, religion) are strictly excluded from all scoring.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900/90">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
