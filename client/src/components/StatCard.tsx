import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'purple';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
}) => {
  const colorStyles = {
    blue: 'from-blue-600/20 to-blue-900/10 border-blue-500/30 text-blue-400',
    emerald: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-600/20 to-amber-900/10 border-amber-500/30 text-amber-400',
    indigo: 'from-indigo-600/20 to-indigo-900/10 border-indigo-500/30 text-indigo-400',
    purple: 'from-purple-600/20 to-purple-900/10 border-purple-500/30 text-purple-400',
  };

  return (
    <div className={`p-5 rounded-2xl glass-card border bg-gradient-to-br ${colorStyles[color]} flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <div className="mt-2 inline-flex items-center text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};
