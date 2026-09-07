import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Award,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  HelpCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { getCandidateById, updateCandidateStatus } from '../services/api';
import { Candidate, ScreeningResult } from '../types';
import { ExplainableScoreModal } from '../components/ExplainableScoreModal';
import { InterviewModal } from '../components/InterviewModal';

export const CandidateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  useEffect(() => {
    if (id) loadCandidate(id);
  }, [id]);

  const loadCandidate = async (candId: string) => {
    setIsLoading(true);
    try {
      const data = await getCandidateById(candId);
      setCandidate(data);
    } catch (err) {
      console.warn('Error loading candidate profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!candidate) return;
    try {
      await updateCandidateStatus(candidate.id, newStatus);
      setCandidate({ ...candidate, status: newStatus as any });
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-400 text-sm">Loading candidate evaluation profile...</div>;
  }

  if (!candidate) {
    return (
      <div className="p-12 text-center text-slate-400">
        Candidate not found. <button onClick={() => navigate('/candidates')} className="text-blue-400 underline ml-2">Back to list</button>
      </div>
    );
  }

  const screening: ScreeningResult | undefined = candidate.screeningResults?.[0];
  const score = screening?.overallScore || 0;
  const parsedData = candidate.parsedData || {};

  return (
    <div className="space-y-8">
      {/* Top Back Navigation */}
      <button
        onClick={() => navigate('/candidates')}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> <span>Back to Candidate Rankings</span>
      </button>

      {/* Candidate Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{candidate.name}</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                candidate.status.includes('STRONG') || candidate.status.includes('INTERVIEW_RECOMMENDED')
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : candidate.status.includes('POTENTIAL')
                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                  : candidate.status.includes('WEAK')
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-red-500/10 text-red-300 border-red-500/30'
              }`}
            >
              {candidate.status.replace('_', ' ')}
            </span>
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" /> {candidate.email}</div>
            {candidate.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {candidate.phone}</div>}
            {candidate.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {candidate.location}</div>}
          </div>

          {/* External Links */}
          <div className="flex items-center space-x-3 text-xs">
            {candidate.linkedin && (
              <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
            {candidate.github && (
              <a href={candidate.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
            {candidate.portfolio && (
              <a href={candidate.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition">
                <Globe className="w-3.5 h-3.5" /> Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Large Score Dial Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 border border-blue-500/30 flex flex-col items-center justify-center text-center space-y-3 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Screening Score</span>
          <div className="text-5xl font-black text-blue-400 font-mono tracking-tight">{score} <span className="text-xl text-slate-500 font-normal">/ 100</span></div>
          {screening && (
            <button
              onClick={() => setIsExplainOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold transition flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Why {score}? Breakdown
            </button>
          )}
        </div>
      </div>

      {/* Human-in-the-Loop HR Action Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span><strong>Human-in-the-Loop HR Decision:</strong> AI recommends <em>{screening?.recommendation.replace('_', ' ')}</em>.</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleStatusChange('REJECTED')}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold border border-red-500/30 transition"
          >
            Reject Candidate
          </button>
          <button
            onClick={() => handleStatusChange('INTERVIEW_RECOMMENDED')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            Move to Interview Stage
          </button>
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Schedule Interview & Send Email
          </button>
        </div>
      </div>

      {/* Grid Content: AI Reasoning + Strengths & Missing Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Summary & Reasoning */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Evidence-Based Reasoning Card */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" /> Why this candidate? AI Evidence-Based Evaluation
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {screening?.summary || 'Candidate evaluation complete.'}
            </p>

            {/* Experience Timeline */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Professional Experience Timeline
              </h4>

              <div className="space-y-3">
                {(parsedData.experience || []).map((exp: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-white">
                      <span>{exp.jobTitle}</span>
                      <span className="text-slate-400 text-[11px] font-mono">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-blue-400 font-semibold">{exp.company}</div>
                    {exp.responsibilities && (
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5 pt-1 text-[11px]">
                        {exp.responsibilities.map((r: string, rIdx: number) => (
                          <li key={rIdx}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education History */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-400" /> Education History
              </h4>

              {(parsedData.education || []).map((edu: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{edu.degree}</div>
                    <div className="text-slate-400">{edu.institution}</div>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{edu.graduationYear}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Strengths, Missing Reqs, Skills Stack */}
        <div className="space-y-6">
          {/* AI Strengths */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> AI Verified Strengths
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {(screening?.strengths || []).map((str, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Requirements */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Missing Requirements / Gaps
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {(screening?.missingRequirements || []).map((req, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorized Skills Stack */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Tech Stack</h3>
            <div className="flex flex-wrap gap-1.5">
              {(parsedData.skills?.technical || []).map((tech: string) => (
                <span key={tech} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {screening && (
        <ExplainableScoreModal
          isOpen={isExplainOpen}
          onClose={() => setIsExplainOpen(false)}
          candidateName={candidate.name}
          screening={screening}
          candidate={candidate}
        />
      )}

      <InterviewModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        candidate={candidate}
        onSuccess={() => loadCandidate(candidate.id)}
      />
    </div>
  );
};
