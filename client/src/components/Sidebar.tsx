import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Bot,
  Upload,
  Calendar,
  Bell,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', path: '/jobs', icon: Briefcase },
  { name: 'Candidates', path: '/candidates', icon: Users },
  { name: 'AI Screening Agent', path: '/agent', icon: Bot, badge: 'Active' },
  { name: 'Upload CVs', path: '/upload', icon: Upload },
  { name: 'Interviews', path: '/interviews', icon: Calendar },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">
              HireFlow <span className="text-blue-500">AI</span>
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
              Screening Agent
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner */}
      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/60 text-slate-300">
        <div className="flex items-center space-x-2 text-blue-400 mb-1">
          <Zap className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Agentic Workflow</span>
        </div>
        <p className="text-xs text-slate-400 leading-snug">
          Automated resume parsing, requirement evaluation, transparent scoring, and scheduling.
        </p>
      </div>
    </aside>
  );
};
