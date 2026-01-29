
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, trend, trendColor }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <div className="p-2 bg-slate-700/50 rounded-lg text-blue-400">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {trend && (
          <span className={`text-xs font-semibold ${trendColor || 'text-emerald-400'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
