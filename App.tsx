
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Database, 
  AlertTriangle, 
  CreditCard, 
  MapPin, 
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  Settings2,
  Terminal,
  LayoutDashboard,
  Zap,
  BarChart3,
  Bell,
  User,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from 'recharts';
import { Transaction, TransactionStatus, DashboardStats, DetectionRule } from './types';
import { analyzeSuspiciousTransaction } from './services/geminiService';
import { StatsCard } from './components/StatsCard';
import { SimulationControls } from './components/SimulationControls';
import { LoginPage } from './components/LoginPage';

const LOCATIONS = ['New York, NY', 'London, UK', 'Tokyo, JP', 'Berlin, DE', 'San Francisco, CA', 'Sydney, AU', 'Cairo, EG', 'Rio de Janeiro, BR'];
const CATEGORIES: ('TRANSFER' | 'ATM' | 'POS' | 'ONLINE')[] = ['TRANSFER', 'ATM', 'POS', 'ONLINE'];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulation' | 'analytics'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [fraudProbability, setFraudProbability] = useState(0.15);
  const [simulationSpeed, setSimulationSpeed] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalVolume: 0,
    fraudRate: 0,
    blockedAttempts: 0,
    activeAlerts: 0
  });

  const [rules, setRules] = useState<DetectionRule[]>([
    { id: '1', name: 'Large Value Monitoring', threshold: 10000, enabled: true, type: 'AMOUNT' },
    { id: '2', name: 'Cross-Border Threshold', threshold: 5000, enabled: true, type: 'AMOUNT' },
    { id: '3', name: 'High Frequency POS', threshold: 10, enabled: false, type: 'FREQUENCY' }
  ]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateTransaction = useCallback((): Transaction => {
    const isFraud = Math.random() < fraudProbability;
    const amount = isFraud 
      ? Math.floor(Math.random() * 45000) + 5000 
      : Math.floor(Math.random() * 2500);
    
    return {
      id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: Date.now(),
      amount,
      sender: `ACC-${Math.floor(Math.random() * 900000) + 100000}`,
      receiver: `ACC-${Math.floor(Math.random() * 900000) + 100000}`,
      type: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      status: TransactionStatus.LEGIT,
      riskScore: Math.floor(Math.random() * 25),
    };
  }, [fraudProbability]);

  const processDetection = async (tx: Transaction) => {
    let finalStatus = TransactionStatus.LEGIT;
    let riskScore = tx.riskScore;
    let aiReasoning = '';

    for (const rule of rules) {
      if (rule.enabled && rule.type === 'AMOUNT' && tx.amount > rule.threshold) {
        finalStatus = TransactionStatus.SUSPICIOUS;
        riskScore = Math.max(riskScore, 60 + Math.floor(Math.random() * 15));
      }
    }

    if (finalStatus === TransactionStatus.SUSPICIOUS || tx.amount > 12000) {
      const analysis = await analyzeSuspiciousTransaction(tx);
      finalStatus = analysis.status;
      riskScore = analysis.riskScore;
      aiReasoning = analysis.reason;
    }

    return { ...tx, status: finalStatus, riskScore, aiReasoning };
  };

  useEffect(() => {
    if (isSimulating && isLoggedIn) {
      timerRef.current = setInterval(async () => {
        const rawTx = generateTransaction();
        const processedTx = await processDetection(rawTx);
        
        setTransactions(prev => [processedTx, ...prev].slice(0, 100));
        
        setStats(prev => {
          const newVolume = prev.totalVolume + processedTx.amount;
          const isFraud = processedTx.status === TransactionStatus.FRAUD;
          const isSuspicious = processedTx.status === TransactionStatus.SUSPICIOUS;
          const newBlocked = prev.blockedAttempts + (isFraud ? 1 : 0);
          return {
            totalVolume: newVolume,
            activeAlerts: prev.activeAlerts + (isFraud || isSuspicious ? 1 : 0),
            blockedAttempts: newBlocked,
            fraudRate: Number(((newBlocked / (transactions.length + 1)) * 100).toFixed(2))
          };
        });
      }, 1000 / simulationSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating, isLoggedIn, simulationSpeed, generateTransaction, rules, transactions.length]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const chartData = transactions.slice(0, 20).reverse().map((tx) => ({
    time: new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    amount: tx.amount,
    risk: tx.riskScore
  }));

  const filteredTransactions = transactions.filter(tx => 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-[#020617] z-30">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">SENTINEL</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'simulation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
          >
            <Zap size={20} /> Simulation Hub
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
          >
            <BarChart3 size={20} /> ML Analytics
          </button>
        </nav>

        <div className="p-4 mt-auto space-y-2">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all uppercase tracking-widest"
          >
            <LogOut size={16} /> Terminate Session
          </button>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Core Engine Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white capitalize">{activeTab} View</h1>
            <p className="text-xs text-slate-500">Real-time fraud monitoring and threat simulation.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search transaction..." 
                className="bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm w-72 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                  label="Total Scanned" 
                  value={transactions.length} 
                  icon={<Activity size={20} />} 
                  trend="+2.4%" 
                />
                <StatsCard 
                  label="Flags Raised" 
                  value={stats.activeAlerts} 
                  icon={<AlertTriangle size={20} className="text-amber-500" />} 
                  trend="+2.4%" 
                />
                <StatsCard 
                  label="Avg Risk Score" 
                  value={transactions.length > 0 ? Math.floor(transactions.reduce((acc, t) => acc + t.riskScore, 0) / transactions.length) : 0} 
                  icon={<BarChart3 size={20} className="text-indigo-400" />} 
                  trend="+2.4%" 
                />
                <StatsCard 
                  label="Rule Accuracy" 
                  value="100%" 
                  icon={<CheckCircle2 size={20} className="text-emerald-400" />} 
                  trend="+2.4%" 
                />
              </div>

              {/* Main Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs">Transaction Traffic Monitor</h3>
                    <div className="flex gap-2">
                       <span className="h-2 w-2 rounded-full bg-indigo-500" />
                       <span className="h-2 w-2 rounded-full bg-slate-700" />
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#4f46e5" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs mb-6">Detection Engine Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                            <CheckCircle2 size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">Heuristics</p>
                            <p className="text-[10px] text-slate-500">Active (v2.1)</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20">STABLE</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                            <BrainCircuit size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">Gemini ML</p>
                            <p className="text-[10px] text-slate-500">Neural Hub</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded border border-indigo-500/20">READY</span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Footer Stats */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <Zap size={14} className="text-amber-500" />
                       <span className="text-[10px] font-mono text-slate-400">LATENCY 127ms</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <TrendingUp size={14} className="text-indigo-400" />
                       <span className="text-[10px] font-mono text-slate-400">TPS {simulationSpeed}.0</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Transactions Feed */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300">Live Gateway Feed</h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Ingestion
                  </div>
                </div>
                <div className="max-h-[400px] overflow-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950/50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3">Transaction</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Risk</th>
                        <th className="px-6 py-3">Reasoning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-slate-800 rounded text-slate-400"><CreditCard size={14}/></div>
                              <div>
                                <p className="text-xs font-bold text-white font-mono">{tx.id}</p>
                                <p className="text-[10px] text-slate-500">${tx.amount.toLocaleString()} • {tx.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             {tx.status === TransactionStatus.FRAUD ? (
                                <span className="text-[9px] font-bold bg-rose-500/10 text-rose-500 px-2 py-1 rounded border border-rose-500/20 uppercase tracking-tighter">Fraud Blocked</span>
                             ) : tx.status === TransactionStatus.SUSPICIOUS ? (
                                <span className="text-[9px] font-bold bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20 uppercase tracking-tighter">Suspicious</span>
                             ) : (
                                <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-tighter">Legit Pass</span>
                             )}
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                               <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                 <div className={`h-full ${tx.riskScore > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${tx.riskScore}%` }} />
                               </div>
                               <span className="text-[10px] font-bold font-mono text-slate-500">{tx.riskScore}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-[10px] text-slate-400 italic max-w-xs truncate">{tx.aiReasoning || 'Automated classification'}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'simulation' && (
            <div className="max-w-3xl mx-auto space-y-8">
               <SimulationControls 
                isActive={isSimulating}
                onToggle={() => setIsSimulating(!isSimulating)}
                onClear={() => {
                  setTransactions([]);
                  setStats({ totalVolume: 0, fraudRate: 0, blockedAttempts: 0, activeAlerts: 0 });
                }}
                fraudProbability={fraudProbability}
                setFraudProbability={setFraudProbability}
                speed={simulationSpeed}
                setSpeed={setSimulationSpeed}
              />

              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                    <Settings2 size={16} /> Detection Heuristics
                  </h3>
                  <div className="h-1 w-12 bg-indigo-500/20 rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rules.map(rule => (
                    <div key={rule.id} className="group relative overflow-hidden flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                      <div className="z-10">
                        <p className="text-sm font-bold text-slate-200">{rule.name}</p>
                        <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">{rule.type} &gt; ${rule.threshold}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer z-10">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={rule.enabled} 
                          onChange={() => {
                            setRules(rules.map(r => r.id === rule.id ? {...r, enabled: !r.enabled} : r));
                          }}
                        />
                        <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <BarChart3 size={64} className="opacity-10" />
              <p className="text-sm font-bold uppercase tracking-widest">Analytics Module Loading...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
