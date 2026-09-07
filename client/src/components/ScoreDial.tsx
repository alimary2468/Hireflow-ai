import React from 'react';

interface ScoreDialProps {
  score: number;
  recommendation?: 'STRONG_MATCH' | 'POTENTIAL_MATCH' | 'WEAK_MATCH' | 'REJECT';
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreDial: React.FC<ScoreDialProps> = ({ score, recommendation, size = 'md' }) => {
  const getColors = (val: number) => {
    if (val >= 85) return { stroke: '#10b981', text: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', label: 'Strong Match' };
    if (val >= 70) return { stroke: '#3b82f6', text: 'text-blue-400', badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30', label: 'Potential Match' };
    if (val >= 50) return { stroke: '#f59e0b', text: 'text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30', label: 'Weak Match' };
    return { stroke: '#ef4444', text: 'text-red-400', badgeBg: 'bg-red-500/10 text-red-300 border-red-500/30', label: 'Reject' };
  };

  const { stroke, text, badgeBg, label } = getColors(score);

  const radius = size === 'lg' ? 42 : size === 'sm' ? 24 : 32;
  const strokeWidth = size === 'lg' ? 8 : size === 'sm' ? 4 : 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const widthHeight = (radius + strokeWidth) * 2;

  return (
    <div className="flex items-center space-x-3">
      <div className="relative inline-flex items-center justify-center">
        <svg width={widthHeight} height={widthHeight} className="transform -rotate-90">
          <circle
            cx={widthHeight / 2}
            cy={widthHeight / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={widthHeight / 2}
            cy={widthHeight / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className={`absolute font-black ${text} ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-xs' : 'text-base'}`}>
          {score}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">AI Score</span>
        <span className={`mt-0.5 inline-block font-semibold px-2.5 py-0.5 rounded-full text-xs border ${badgeBg}`}>
          {recommendation ? recommendation.replace('_', ' ') : label}
        </span>
      </div>
    </div>
  );
};
