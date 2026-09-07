import React, { useState } from 'react';
import { Bot, CheckCircle2, Loader2, Sparkles, Play, ShieldAlert, Cpu } from 'lucide-react';

const stages = [
  { id: 1, name: 'CV Document Uploaded', agent: 'Ingestion Service', desc: 'Secure PDF/DOC text extraction with format validation.' },
  { id: 2, name: 'CV Parsing Agent', agent: 'Agent 1 — Parser', desc: 'Extracts contact info, experience timeline, technical skills, education.' },
  { id: 3, name: 'Job Requirement Analyzer', agent: 'Agent 2 — Analyzer', desc: 'Converts job description into weighted criteria & mandatory skills.' },
  { id: 4, name: 'Candidate Matching Agent', agent: 'Agent 3 — Matcher', desc: 'Performs semantic candidate matching; excludes protected personal traits.' },
  { id: 5, name: 'Scoring Engine Agent', agent: 'Agent 4 — Scoring', desc: 'Calculates transparent 100-point score across 5 rubric categories.' },
  { id: 6, name: 'Decision & Evidence Agent', agent: 'Agent 5 — Recommendation', desc: 'Generates evidence-backed reasoning, strengths, and interview recommendation.' },
];

export const AgentVisualizerPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(6);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState('Ahmed Khan (Frontend Developer)');

  const runSimulation = () => {
    setIsSimulating(true);
    setActiveStep(1);

    let current = 1;
    const interval = setInterval(() => {
      current++;
      if (current <= 6) {
        setActiveStep(current);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-500/20 glass-panel">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Agentic AI Pipeline Inspector
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 flex items-center gap-2">
            <Bot className="w-7 h-7 text-blue-400" /> AI Candidate Screening Agent Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time visualization of autonomous multi-agent evaluation stages during candidate processing.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 transition flex items-center space-x-2 w-fit disabled:opacity-50"
        >
          {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isSimulating ? 'Screening in Progress...' : 'Simulate Agent Pipeline'}</span>
        </button>
      </div>

      {/* Selected Candidate Inspector Context */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>Active Inspection Target: <strong>{selectedCandidate}</strong></span>
        </div>

        <div className="flex items-center space-x-2 text-slate-400">
          <span>Status:</span>
          <span className={`font-bold px-2.5 py-0.5 rounded-full ${activeStep === 6 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'}`}>
            {activeStep === 6 ? 'Evaluation Complete (92/100)' : `Executing Stage ${activeStep} of 6`}
          </span>
        </div>
      </div>

      {/* Stage Flow Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stages.map((stage) => {
          const isDone = stage.id < activeStep || (activeStep === 6 && stage.id === 6);
          const isCurrent = stage.id === activeStep && isSimulating;

          return (
            <div
              key={stage.id}
              className={`p-6 rounded-3xl glass-card border transition-all duration-500 relative ${
                isCurrent
                  ? 'border-blue-500 bg-blue-950/40 shadow-xl shadow-blue-500/20 scale-[1.02]'
                  : isDone
                  ? 'border-slate-800 bg-slate-900/60'
                  : 'border-slate-800/40 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  {stage.agent}
                </span>

                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                )}
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">{stage.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{stage.desc}</p>

              {isCurrent && (
                <div className="mt-4 pt-3 border-t border-blue-500/30 text-[11px] text-blue-300 font-semibold flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" /> LLM Reasoning Active...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Safeguards Summary */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" /> Autonomous Agent Guarantees & Safeguards
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The AI screening pipeline enforces strict safety boundaries: prompt injection instructions embedded in resumes are completely ignored, personal demographic traits are scrubbed prior to evaluation, and final hiring authority rests entirely with HR personnel.
        </p>
      </div>
    </div>
  );
};
