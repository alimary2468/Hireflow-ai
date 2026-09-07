import React, { useState } from 'react';
import { X, Calendar, Clock, Video, User, Link as LinkIcon, Mail, Send, CheckCircle } from 'lucide-react';
import { scheduleInterview } from '../services/api';
import { Candidate, Job } from '../types';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  job?: Job;
  onSuccess?: () => void;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  candidate,
  job,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [interviewer, setInterviewer] = useState('Sarah Jenkins (Lead Engineering Manager)');
  const [date, setDate] = useState('2026-09-10');
  const [startTime, setStartTime] = useState('02:00 PM');
  const [duration, setDuration] = useState('45 minutes');
  const [type, setType] = useState('Video');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/hfl-hire-flow');
  const [additionalMessage, setAdditionalMessage] = useState(
    'Please join 5 minutes early with a stable internet connection. Looking forward to our conversation!'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledResult, setScheduledResult] = useState<{ emailSent: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await scheduleInterview({
        candidateId: candidate.id,
        jobId: job?.id || candidate.latestScreening?.jobId || 'job_demo_id',
        interviewer,
        date,
        startTime,
        duration,
        type,
        meetingLink,
        additionalMessage,
      });

      setScheduledResult({ emailSent: res.emailSent, message: res.emailMessage });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1800);
    } catch (err: any) {
      alert(`Scheduling failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Human-in-the-Loop Scheduler
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Schedule Interview with {candidate.name}</h3>
            <p className="text-xs text-slate-400">Position: {job?.title || 'Frontend Developer'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scheduled Success Toast Overlay */}
        {scheduledResult ? (
          <div className="p-8 text-center my-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-white">Interview Scheduled!</h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto">{scheduledResult.message}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold">
              <Mail className="w-3.5 h-3.5" /> Auto Invitation Email Sent to {candidate.email}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {/* Interviewer */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Interviewer Name & Role
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Interview Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="02:00 PM"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Duration & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="30 minutes">30 minutes</option>
                  <option value="45 minutes">45 minutes</option>
                  <option value="60 minutes">60 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Interview Format
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Video">Video (Google Meet / Zoom)</option>
                  <option value="Phone">Phone Call</option>
                  <option value="In-person">In-Person (Office)</option>
                </select>
              </div>
            </div>

            {/* Meeting Link */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Meeting URL Link
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Additional Message */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Additional Instructions / HR Message
              </label>
              <textarea
                rows={2}
                value={additionalMessage}
                onChange={(e) => setAdditionalMessage(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email Preview Card */}
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-blue-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Auto Email Invitation Preview
              </div>
              <p>Subject: <em>Interview Invitation — {job?.title || 'Frontend Developer'}</em></p>
              <p className="text-[11px] text-slate-400">Recipient: <strong>{candidate.email}</strong></p>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Invitation...' : 'Schedule & Send Email'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
