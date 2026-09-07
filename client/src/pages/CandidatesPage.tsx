import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Award,
  Calendar,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { getCandidates, getJobs } from '../services/api';
import { Candidate, Job, ScreeningResult } from '../types';
import { ScoreDial } from '../components/ScoreDial';
import { ExplainableScoreModal } from '../components/ExplainableScoreModal';
import { InterviewModal } from '../components/InterviewModal';

export const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [jobFilter, setJobFilter] = useState(searchParams.get('jobId') || 'ALL');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'score_desc');

  // Modals
  const [selectedCandidateForExplain, setSelectedCandidateForExplain] = useState<{ candidate: Candidate; screening: ScreeningResult } | null>(null);
  const [selectedCandidateForSchedule, setSelectedCandidateForSchedule] = useState<Candidate | null>(null);

  useEffect(() => {
    loadData();
  }, [statusFilter, jobFilter, searchQuery, sortBy]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cData, jData] = await Promise.all([
        getCandidates({ status: statusFilter, jobId: jobFilter, search: searchQuery, sortBy }),
        getJobs(),
      ]);
      setCandidates(cData);
      setJobs(jData);
    } catch (err) {
      console.warn('Candidates load note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Candidate Rankings & Evaluations</h2>
          <p className="text-xs text-slate-400">AI-ranked applicant list sorted by transparent qualification scores.</p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center space-x-2 w-fit"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>Upload & Screen New CV</span>
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, email, skills..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="STRONG_MATCH">Strong Match (85+)</option>
              <option value="POTENTIAL_MATCH">Potential Match (70-84)</option>
              <option value="WEAK_MATCH">Weak Match (50-69)</option>
              <option value="REJECTED">Rejected (&lt;50)</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            </select>
          </div>

          {/* Job Filter */}
          <div className="text-xs text-slate-400">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Positions</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
          >
            <option value="score_desc">Overall Score (High to Low)</option>
            <option value="skills_desc">Skills Match %</option>
            <option value="experience_desc">Experience Duration</option>
          </select>
        </div>
      </div>

      {/* Candidate Ranking Table */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Skills Match</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Human Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    No matching candidates found for current filter criteria.
                  </td>
                </tr>
              ) : (
                candidates.map((cand, idx) => {
                  const screening = cand.latestScreening;
                  const score = screening?.overallScore || 0;
                  const skillsPct = Math.round(((screening?.skillsScore || 0) / 40) * 100);

                  return (
                    <tr key={cand.id} className="hover:bg-slate-800/50 transition group">
                      {/* Rank # */}
                      <td className="py-4 px-4 text-center font-extrabold font-mono text-slate-400 text-sm">
                        #{idx + 1}
                      </td>

                      {/* Candidate info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-sm hover:text-blue-400 cursor-pointer" onClick={() => navigate(`/candidates/${cand.id}`)}>
                          {cand.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{cand.email}</div>
                      </td>

                      {/* Job title */}
                      <td className="py-4 px-4 text-slate-300 font-medium">
                        {screening?.job?.title || 'Frontend Developer'}
                      </td>

                      {/* Overall Score Dial */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <ScoreDial score={score} size="sm" />
                          {screening && (
                            <button
                              onClick={() => setSelectedCandidateForExplain({ candidate: cand, screening })}
                              className="text-[11px] text-blue-400 hover:underline font-semibold flex items-center gap-0.5 ml-1"
                              title="Click to view explainable score breakdown"
                            >
                              <HelpCircle className="w-3.5 h-3.5" /> Why {score}?
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Skills match bar */}
                      <td className="py-4 px-4">
                        <div className="w-28">
                          <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-1">
                            <span>Matching Stack</span>
                            <span>{skillsPct}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${skillsPct}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-4 font-mono text-slate-300">
                        {cand.totalExperienceYears} yrs
                      </td>

                      {/* Category status badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full font-bold text-[11px] border inline-flex items-center gap-1 ${
                            cand.status.includes('STRONG') || cand.status.includes('INTERVIEW_RECOMMENDED')
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : cand.status.includes('POTENTIAL')
                              ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                              : cand.status.includes('WEAK')
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-red-500/10 text-red-300 border-red-500/30'
                          }`}
                        >
                          {cand.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Human-in-the-loop actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/candidates/${cand.id}`)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => setSelectedCandidateForSchedule(cand)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold transition flex items-center gap-1"
                          >
                            <Calendar className="w-3.5 h-3.5" /> Schedule
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainable AI Modal */}
      {selectedCandidateForExplain && (
        <ExplainableScoreModal
          isOpen={Boolean(selectedCandidateForExplain)}
          onClose={() => setSelectedCandidateForExplain(null)}
          candidateName={selectedCandidateForExplain.candidate.name}
          screening={selectedCandidateForExplain.screening}
          candidate={selectedCandidateForExplain.candidate}
        />
      )}

      {/* Interview Scheduler Modal */}
      {selectedCandidateForSchedule && (
        <InterviewModal
          isOpen={Boolean(selectedCandidateForSchedule)}
          onClose={() => setSelectedCandidateForSchedule(null)}
          candidate={selectedCandidateForSchedule}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};
