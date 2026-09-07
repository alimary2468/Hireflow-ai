import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, User, Link as LinkIcon, Mail, CheckCircle } from 'lucide-react';
import { getInterviews } from '../services/api';
import { Interview } from '../types';

export const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    setIsLoading(true);
    try {
      const data = await getInterviews();
      setInterviews(data);
    } catch (e) {
      console.warn('Error loading interviews:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Interview Pipeline & Schedules</h2>
        <p className="text-xs text-slate-400">Track human-approved candidate interview sessions and email dispatch status.</p>
      </div>

      {/* Interviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interviews.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-slate-400 glass-card rounded-3xl">
            No interviews scheduled yet. Select a candidate from Rankings to schedule an interview.
          </div>
        ) : (
          interviews.map((item) => (
            <div key={item.id} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                    {item.job?.title || 'Frontend Developer'}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{item.candidate?.name || 'Ahmed Khan'}</h3>
                  <p className="text-xs text-slate-400">{item.candidate?.email}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {item.status}
                </span>
              </div>

              {/* Details List */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <span><strong>Date:</strong> {item.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span><strong>Time:</strong> {item.startTime} ({item.duration})</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400 shrink-0" />
                  <span><strong>Interviewer:</strong> {item.interviewer}</span>
                </div>
                {item.meetingLink && (
                  <div className="flex items-center gap-2 truncate">
                    <LinkIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Link:</strong> <a href={item.meetingLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{item.meetingLink}</a></span>
                  </div>
                )}
              </div>

              {/* Email Sent Indicator */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Mail className="w-3.5 h-3.5" /> Invitation Email Dispatched
                </span>
                <span className="text-[10px] font-mono text-slate-500">Format: {item.type}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
