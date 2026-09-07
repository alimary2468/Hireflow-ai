import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sparkles, RefreshCw, CheckCircle, User as UserIcon } from 'lucide-react';
import { getHealthCheck, getNotifications, markAllNotificationsAsRead, resetDemoData } from '../services/api';
import { NotificationItem } from '../types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [aiMode, setAiMode] = useState<string>('Checking...');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchHealth();
    fetchNotifs();
  }, []);

  const fetchHealth = async () => {
    try {
      const data = await getHealthCheck();
      setAiMode(data.aiMode);
    } catch {
      setAiMode('Smart Fallback Engine (Demo)');
    }
  };

  const fetchNotifs = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (e) {
      console.warn('Error loading notifications:', e);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/candidates?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await resetDemoData();
      await fetchNotifs();
      window.location.reload();
    } catch (err) {
      alert('Failed to reset demo dataset');
    } finally {
      setIsResetting(false);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global Search candidates, skills (React, TypeScript), jobs..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* AI Mode Indicator */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/30 text-blue-300">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>AI Mode: {aiMode.includes('Live') ? 'Live LLM' : 'Demo Mode'}</span>
        </div>

        {/* Load Demo Data Button */}
        <button
          onClick={handleResetDemo}
          disabled={isResetting}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50"
          title="Reset and populate candidate dataset for hackathon judges"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Loading Demo...' : 'Load Demo Data'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl p-4 z-50 border border-slate-700 text-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-400" /> Notifications
                </h4>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs text-blue-400 hover:underline">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 py-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl text-xs transition border ${
                        n.read ? 'bg-slate-800/40 border-slate-800 text-slate-400' : 'bg-blue-950/40 border-blue-800/50 text-slate-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-blue-300">{n.title}</span>
                        <span className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
            SJ
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-200">Sarah Jenkins</p>
            <p className="text-[10px] text-slate-400">HR Recruiter Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};
