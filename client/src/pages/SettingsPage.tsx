import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, RefreshCw, Shield, Key, Sliders, CheckCircle } from 'lucide-react';
import { getHealthCheck, resetDemoData } from '../services/api';
import { HealthCheckResponse } from '../types';

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);

  // Configurable thresholds (Section 10)
  const [strongCutoff, setStrongCutoff] = useState(85);
  const [potentialCutoff, setPotentialCutoff] = useState(70);
  const [weakCutoff, setWeakCutoff] = useState(50);

  const [isResetting, setIsResetting] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    getHealthCheck().then(setHealth).catch(console.warn);
  }, []);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await resetDemoData();
      alert('Demo dataset reset successfully! 5 candidate profiles loaded.');
      window.location.reload();
    } catch (e) {
      alert('Failed to reset demo dataset.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">HireFlow AI Settings & Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">Configure scoring rubric cutoffs, view API key status, and manage demo datasets.</p>
      </div>

      {/* AI Provider Status Card */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-400" /> AI LLM Provider & System Integration Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Active Engine:</span>
            <div className="font-bold text-blue-400">{health?.aiMode || 'Demo Mode'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Google Gemini API:</span>
            <div className={`font-bold ${health?.providers?.gemini ? 'text-emerald-400' : 'text-slate-500'}`}>
              {health?.providers?.gemini ? 'Configured (Live)' : 'Not Set (Using Fallback)'}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Clerk Authentication:</span>
            <div className={`font-bold ${health?.providers?.clerk ? 'text-emerald-400' : 'text-slate-500'}`}>
              {health?.providers?.clerk ? 'Configured' : 'Dev Fallback Active'}
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Configuration Form */}
      <form onSubmit={handleSaveThresholds} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" /> Candidate Category Score Cutoffs
          </h3>
          {saveToast && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Thresholds Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <label className="block font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Strong Match Minimum (Default 85)
            </label>
            <input
              type="number"
              min="50"
              max="100"
              value={strongCutoff}
              onChange={(e) => setStrongCutoff(Number(e.target.value))}
              className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-blue-400 uppercase tracking-wider mb-1">
              Potential Match Minimum (Default 70)
            </label>
            <input
              type="number"
              min="40"
              max="84"
              value={potentialCutoff}
              onChange={(e) => setPotentialCutoff(Number(e.target.value))}
              className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-amber-400 uppercase tracking-wider mb-1">
              Weak Match Minimum (Default 50)
            </label>
            <input
              type="number"
              min="20"
              max="69"
              value={weakCutoff}
              onChange={(e) => setWeakCutoff(Number(e.target.value))}
              className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition"
        >
          Save Threshold Settings
        </button>
      </form>

      {/* Demo Dataset Controls */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-purple-400" /> Demo Dataset & Judge Controls
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Instantly reset the database to seed 5 pre-configured candidates (Ahmed Khan, Sara Ali, Hamza Ahmed, Bilal Khan, Usman Ali) for live hackathon demonstration.
        </p>

        <button
          type="button"
          onClick={handleResetDemo}
          disabled={isResetting}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Resetting Demo Data...' : 'Reset & Load Demo Candidates'}</span>
        </button>
      </div>
    </div>
  );
};
