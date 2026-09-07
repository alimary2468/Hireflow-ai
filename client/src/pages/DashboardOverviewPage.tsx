import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  Award,
  Calendar,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  UserCheck,
  Plus,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ScoreDial } from '../components/ScoreDial';
import { CreateJobModal } from '../components/CreateJobModal';
import { getDashboardStats, getCandidates } from '../services/api';
import { DashboardStats, Candidate } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DashboardOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sData, cData] = await Promise.all([getDashboardStats(), getCandidates()]);
      setStats(sData);
      setRecentCandidates(cData.slice(0, 5));
    } catch (err) {
      console.warn('Dashboard load note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 p-6 rounded-3xl border border-blue-500/20 glass-panel">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>AI Recruitment Operations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">HR Candidate Screening Dashboard</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated resume parsing, 100-point transparent scoring, candidate ranking, and email automation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsJobModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Job</span>
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
          >
            Upload CVs
          </button>
        </div>
      </div>

      {/* Section 5 Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Candidates"
          value={stats?.totalCandidates ?? 0}
          subtitle="Registered in system"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Candidates Screened"
          value={stats?.candidatesScreened ?? 0}
          subtitle="Processed by AI agent"
          icon={CheckCircle}
          color="indigo"
        />
        <StatCard
          title="Strong Matches"
          value={stats?.strongMatches ?? 0}
          subtitle="Score >= 85 threshold"
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Interviews Scheduled"
          value={stats?.interviewsScheduled ?? 0}
          subtitle="Confirmed invitations"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Avg Candidate Score"
          value={stats?.averageScore ? `${stats.averageScore} / 100` : '0 / 100'}
          subtitle="System overall mean"
          icon={BarChart3}
          color="amber"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Pipeline Stage Breakdown Chart */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" /> Recruitment Pipeline Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.pipeline || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {(stats?.pipeline || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#6366f1', '#10b981', '#8b5cf6', '#ec4899'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Category Distribution Chart */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" /> AI Candidate Score Distribution
          </h3>
          <div className="space-y-3 pt-2">
            {(stats?.distribution || []).map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.category}</span>
                  <span className="text-slate-400">{item.count} candidate(s)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stats?.candidatesScreened ? Math.max(5, (item.count / stats.candidatesScreened) * 100) : 0}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Candidates Table */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Candidate Evaluations</h3>
          <button
            onClick={() => navigate('/candidates')}
            className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
          >
            View All Rankings <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-400">
                    No candidates found. Upload a CV or load demo data.
                  </td>
                </tr>
              ) : (
                recentCandidates.map((cand) => {
                  const score = cand.latestScreening?.overallScore || 0;
                  return (
                    <tr key={cand.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{cand.name}</div>
                        <div className="text-[11px] text-slate-400">{cand.email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {cand.latestScreening?.job?.title || 'Frontend Developer'}
                      </td>
                      <td className="py-3 px-4">
                        <ScoreDial score={score} recommendation={cand.latestScreening?.recommendation} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full font-semibold border text-[11px] bg-slate-800 text-slate-200 border-slate-700">
                          {cand.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {cand.totalExperienceYears} yrs
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => navigate(`/candidates/${cand.id}`)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold transition"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateJobModal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} onSuccess={loadData} />
    </div>
  );
};
