import React from 'react';
import { Play, Square, Zap, Trash2 } from 'lucide-react';

interface SimulationControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onClear: () => void;
  fraudProbability: number;
  setFraudProbability: (val: number) => void;
  speed: number;
  setSpeed: (val: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isActive,
  onToggle,
  onClear,
  fraudProbability,
  setFraudProbability,
  speed,
  setSpeed
}) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col gap-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
            <Zap size={20} fill={isActive ? "currentColor" : "none"} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">Simulation Engine</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Status: {isActive ? 'Running' : 'Ready'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors border border-slate-700"
            title="Clear Gateway History"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${
              isActive 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-900/20' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20'
            }`}
          >
            {isActive ? <><Square size={16} fill="currentColor" /> Stop</> : <><Play size={16} fill="currentColor" /> Ingest</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium">Anomaly Injection Rate</span>
            <span className="text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded">{Math.round(fraudProbability * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={fraudProbability}
            onChange={(e) => setFraudProbability(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium">Traffic Ingestion Speed</span>
            <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">{speed} tx/s</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};