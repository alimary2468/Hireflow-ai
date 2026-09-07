import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Mail,
  Calendar,
  FileSearch,
  Users,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => navigate('/dashboard');
  const handleDemo = async () => {
    navigate('/candidates');
  };

  const steps = [
    { num: '01', title: 'Create Job', desc: 'Define required skills, preferred qualifications, and experience thresholds.', icon: FileSearch },
    { num: '02', title: 'Upload CVs', desc: 'Drag & drop batch CVs in PDF, DOC, or DOCX formats for automatic parsing.', icon: Users },
    { num: '03', title: 'AI Screens Candidates', desc: 'Multi-stage AI agents analyze skills, work history, and project relevance.', icon: Bot },
    { num: '04', title: 'Review Rankings', desc: 'Explore transparent 100-point scores with evidence-backed reasoning.', icon: BarChart3 },
    { num: '05', title: 'Schedule Interviews', desc: 'HR approves top matches and picks interview times with a single click.', icon: Calendar },
    { num: '06', title: 'AI Sends Invitations', desc: 'Automated email dispatches professional calendar invitations to candidates.', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            HireFlow <span className="text-blue-500">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleDemo}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            View Demo
          </button>
          <button
            onClick={handleStart}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center space-x-2"
          >
            <span>Start Screening Candidates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-bold mb-8">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Built for Agentic AI Hackathon (Karachi)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Your AI Agent for <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Smarter Candidate Screening</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload CVs, automatically evaluate candidates against your job requirements, rank the best applicants, and schedule interviews in minutes.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/40 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
          >
            <Zap className="w-4 h-4 text-cyan-300" />
            <span>Start Screening Candidates</span>
          </button>
          <button
            onClick={handleDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-extrabold text-sm transition flex items-center justify-center space-x-2"
          >
            <span>Explore Demo Data</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </section>

      {/* 6-Step Workflow Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            End-to-End Autonomous Recruitment Workflow
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            HireFlow AI acts as a dedicated recruitment agent that processes applicants automatically from upload to email invitation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="p-6 rounded-2xl glass-card border border-slate-800 relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-blue-500/40 font-mono">{step.num}</span>
                  <div className="p-3 rounded-xl bg-slate-800/80 text-blue-400 border border-slate-700">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Screening Agent Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Agentic AI Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-4 tracking-tight leading-tight">
              Multi-Agent Reasoning with Explainable Grounding
            </h2>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Unlike generic chatbots, HireFlow AI combines 5 specialized agents that analyze candidate experience, evaluate skills against job criteria, calculate 100-point scores, and present evidence-backed recommendations.
            </p>

            <ul className="space-y-3 mt-6 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Protected Traits Shield:</strong> Strictly excludes gender, race, age, and personal bias.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Prompt Injection Safe:</strong> Blocks malicious prompt overrides embedded inside CVs.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Human-in-the-Loop:</strong> HR maintains full final approval over candidate progression.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" /> AI Agent Live Evaluation Card
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Strong Match
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-semibold">Ahmed Khan — Frontend Developer</span>
                <span className="text-emerald-400 font-bold text-sm">92 / 100</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl text-slate-400 leading-relaxed text-[11px]">
                "Candidate has 4 years experience exceeding requirement. 100% core skill match (React, TypeScript, REST APIs) + bonus points for Next.js."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>HireFlow AI • Agentic Candidate Screening & Recruitment Platform</p>
      </footer>
    </div>
  );
};
