import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { getJobs, uploadAndScreenCV } from '../services/api';
import { Job, Candidate, ScreeningResult } from '../types';

export const UploadCVPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(searchParams.get('jobId') || '');
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ candidate: Candidate; screeningResult: ScreeningResult; job?: { id: string; title: string } } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pipelineSteps = [
    'Receiving & Validating CV Document',
    'Extracting Raw Document Text (PDF/DOCX)',
    'Agent 1: Parsing Candidate Metadata & Tech Stack',
    'Agent 2: Analyzing Target Job Requirements',
    'Agent 3 & 4: Calculating 100-Point Transparent Score',
    'Agent 5: Generating Evidence Reasoning & Ranking Candidate',
  ];

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
      if (data.length > 0 && !selectedJobId) {
        setSelectedJobId(data[0].id);
      }
    } catch (e) {
      console.warn('Jobs load error:', e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setErrorMessage('Please select a CV file to upload');
    if (!selectedJobId) return setErrorMessage('Please select a target job position');

    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < pipelineSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 1100);

    try {
      const result: any = await uploadAndScreenCV(file, selectedJobId);
      clearInterval(stepInterval);
      setCurrentStepIndex(pipelineSteps.length);
      setUploadResult(result);
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.response?.data?.error || err.message || 'CV Upload and AI Screening failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Upload CVs for AI Screening</h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload applicant resumes (PDF, DOC, DOCX up to 10MB) for immediate multi-agent evaluation.
        </p>
      </div>

      {uploadResult ? (
        <div className="p-8 rounded-3xl glass-panel border border-emerald-500/30 space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Screening Complete
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-2">
              {uploadResult.candidate.name} Evaluation Finished!
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Position: <strong>{uploadResult.job?.title || 'Frontend Developer'}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-300">Overall AI Score:</span>
              <span className="text-blue-400 font-mono text-xl">{uploadResult.screeningResult.overallScore} / 100</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Recommendation Category:</span>
              <span className="font-extrabold text-emerald-300">{uploadResult.screeningResult.recommendation.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-4">
            <button
              onClick={() => {
                setUploadResult(null);
                setFile(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Upload Another CV
            </button>
            <button
              onClick={() => navigate(`/candidates/${uploadResult.candidate.id}`)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <span>View Candidate Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Target Job Position *
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.department} ({job.experienceRequired})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Candidate Resume / CV File *
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-950/30'
                  : file
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : 'border-slate-700 bg-slate-900/40 hover:border-slate-600'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload-input"
              />
              <label htmlFor="cv-upload-input" className="cursor-pointer flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-2">
                  <Upload className="w-7 h-7" />
                </div>
                {file ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-center">
                      <FileText className="w-4 h-4" /> {file.name}
                    </p>
                    <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB — Ready to screen</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-bold text-white">Drag and drop CV here, or click to browse</p>
                    <p className="text-xs text-slate-400 mt-1">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isProcessing && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-blue-400" /> AI Agent Processing Pipeline
                </span>
                <span>Stage {Math.min(currentStepIndex + 1, 6)} of 6</span>
              </div>

              <div className="space-y-2 pt-2">
                {pipelineSteps.map((stepName, sIdx) => {
                  const isDone = sIdx < currentStepIndex;
                  const isCurrent = sIdx === currentStepIndex;
                  return (
                    <div key={sIdx} className="flex items-center space-x-3 text-xs">
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span className={isDone ? 'text-slate-400 line-through' : isCurrent ? 'text-white font-bold' : 'text-slate-600'}>
                        {stepName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI Agent is Screening Resume...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span>Start AI Candidate Screening</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
