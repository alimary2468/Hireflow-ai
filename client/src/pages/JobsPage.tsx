import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, MapPin, Clock, DollarSign, Users, Award } from 'lucide-react';
import { getJobs } from '../services/api';
import { Job } from '../types';
import { CreateJobModal } from '../components/CreateJobModal';

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.warn('Jobs load note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Active Job Positions</h2>
          <p className="text-xs text-slate-400">Define position requirements and structured AI screening criteria.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center space-x-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Position</span>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                    {job.department}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1.5">{job.title}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {job.status}
                </span>
              </div>

              {/* Meta details */}
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {job.experienceRequired}
                </div>
                {job.salaryRange && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500" /> {job.salaryRange}
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{job.description}</p>

              {/* Skills Tags */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Required Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-[11px] border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" /> {job._count?.applications ?? 0} Applicants
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/upload?jobId=${job.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Upload CVs
                </button>
                <button
                  onClick={() => navigate(`/candidates?jobId=${job.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold transition"
                >
                  Rankings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateJobModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={loadJobs} />
    </div>
  );
};
