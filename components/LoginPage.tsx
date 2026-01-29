
import React, { useState } from 'react';
import { ShieldAlert, Lock, User, ArrowRight, Loader2, Fingerprint } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ id: '', pin: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate biometric/secure verification
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/5 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-md p-8 z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-600 p-4 rounded-2xl mb-4 shadow-2xl shadow-indigo-900/20">
            <ShieldAlert className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">SENTINEL</h1>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Fraud Detection Terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Operator ID</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="ID-000-SENTINEL"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  value={credentials.id}
                  onChange={e => setCredentials({...credentials, id: e.target.value})}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Security Key / PIN</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  value={credentials.pin}
                  onChange={e => setCredentials({...credentials, pin: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-offset-0 focus:ring-indigo-500/50" />
              <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Trust Terminal</span>
            </label>
            <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">Emergency Bypass</button>
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Fingerprint size={20} />
                <span>Establish Connection</span>
                <ArrowRight size={18} className="ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-800/50 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
            Authorized Personnel Only <br/> 
            <span className="text-slate-700">All activity is monitored by AI core</span>
          </p>
        </div>
      </div>
    </div>
  );
};
