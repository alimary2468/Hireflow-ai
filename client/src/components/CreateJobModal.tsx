import React, { useState } from 'react';
import { X, Briefcase, Plus, CheckCircle } from 'lucide-react';
import { createJob } from '../services/api';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('Frontend Developer');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Karachi, Pakistan (Hybrid)');
  const [employmentType, setEmploymentType] = useState('Full-Time');
  const [experienceRequired, setExperienceRequired] = useState('2+ years');
  const [minExperienceYears, setMinExperienceYears] = useState(2);
  const [salaryRange, setSalaryRange] = useState('PKR 250,000 - 400,000 / month');
  const [requiredSkills, setRequiredSkills] = useState('React, TypeScript, JavaScript, HTML, CSS, REST APIs');
  const [preferredSkills, setPreferredSkills] = useState('Next.js, Tailwind CSS, Git, PostgreSQL');
  const [educationRequirements, setEducationRequirements] = useState(
    "Bachelor's Degree in Computer Science or Software Engineering"
  );
  const [description, setDescription] = useState(
    'We are seeking a skilled Frontend Developer to build modern React applications, implement responsive UI designs, and integrate backend REST APIs.'
  );
  const [responsibilities, setResponsibilities] = useState(
    'Develop reusable React components, optimize page performance, write clean TypeScript code, collaborate with product designers.'
  );
  const [interviewCriteria, setInterviewCriteria] = useState(
    'Phase 1: Resume Screening | Phase 2: React Technical Live Coding | Phase 3: Culture Fit'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reqArray = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const prefArray = preferredSkills.split(',').map((s) => s.trim()).filter(Boolean);

      await createJob({
        title,
        department,
        location,
        employmentType,
        experienceRequired,
        minExperienceYears: Number(minExperienceYears),
        salaryRange,
        requiredSkills: reqArray,
        preferredSkills: prefArray,
        educationRequirements,
        description,
        responsibilities,
        interviewCriteria,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Job creation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Job Architecture Engine
            </span>
            <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" /> Create New Job Position
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Department *</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Min Exp (Years)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={minExperienceYears}
                onChange={(e) => setMinExperienceYears(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Required Mandatory Skills (Comma separated) *
            </label>
            <input
              type="text"
              required
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="React, TypeScript, JavaScript, REST APIs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Preferred Bonus Skills (Comma separated)
            </label>
            <input
              type="text"
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="Next.js, Tailwind CSS, PostgreSQL"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Education Requirements</label>
            <input
              type="text"
              value={educationRequirements}
              onChange={(e) => setEducationRequirements(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Job Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Position...' : 'Create Position'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
