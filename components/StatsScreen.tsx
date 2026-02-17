
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';
import { Session } from '../types';
// Fixed error: Added History to the imports from lucide-react
import { Trash2, Zap, Clock, TrendingUp, Calendar, ChevronRight, History } from 'lucide-react';

type Period = 'Day' | 'Week' | 'Month' | 'Year';

const StatsScreen: React.FC<StatsScreenProps> = ({ sessions, totalMalas, onReset, darkMode }) => {
  const [period, setPeriod] = useState<Period>('Week');

  const lifetimeCount = useMemo(() => sessions.reduce((acc, s) => acc + s.count, 0), [sessions]);

  const chartData = useMemo(() => {
    const now = new Date();
    const data: { name: string, count: number, timestamp: number }[] = [];

    const getDayName = (date: Date) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    const getMonthName = (date: Date) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];

    switch (period) {
      case 'Day':
        // 24 hours of today
        for (let i = 0; i < 24; i++) {
          data.push({ name: `${i}h`, count: 0, timestamp: new Date().setHours(i, 0, 0, 0) });
        }
        sessions.forEach(s => {
          const sDate = new Date(s.startTime);
          if (sDate.toDateString() === now.toDateString()) {
            const hour = sDate.getHours();
            if (data[hour]) data[hour].count += s.count;
          }
        });
        break;

      case 'Week':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          data.push({ 
            name: getDayName(d), 
            count: 0, 
            timestamp: d.setHours(0, 0, 0, 0) 
          });
        }
        sessions.forEach(s => {
          const sDayStart = new Date(s.startTime).setHours(0, 0, 0, 0);
          const entry = data.find(d => d.timestamp === sDayStart);
          if (entry) entry.count += s.count;
        });
        break;

      case 'Month':
        // 4 Weeks of this month
        for (let i = 1; i <= 4; i++) {
          data.push({ name: `W${i}`, count: 0, timestamp: i });
        }
        sessions.forEach(s => {
          const sDate = new Date(s.startTime);
          if (sDate.getMonth() === now.getMonth() && sDate.getFullYear() === now.getFullYear()) {
            const week = Math.min(3, Math.floor((sDate.getDate() - 1) / 7));
            data[week].count += s.count;
          }
        });
        break;

      case 'Year':
        // 12 Months
        for (let i = 0; i < 12; i++) {
          data.push({ name: getMonthName(new Date(now.getFullYear(), i, 1)), count: 0, timestamp: i });
        }
        sessions.forEach(s => {
          const sDate = new Date(s.startTime);
          if (sDate.getFullYear() === now.getFullYear()) {
            if (data[sDate.getMonth()]) data[sDate.getMonth()].count += s.count;
          }
        });
        break;
    }
    return data;
  }, [sessions, period]);

  const stats = useMemo(() => {
    if (sessions.length === 0) return { avg: 0, totalDuration: 0 };
    const validSessions = sessions.filter(s => s.endTime);
    const duration = validSessions.reduce((acc, s) => acc + ((s.endTime! - s.startTime) / 1000 / 60), 0);
    return {
      avg: Math.round(lifetimeCount / (sessions.length || 1)),
      totalDuration: Math.round(duration)
    };
  }, [sessions, lifetimeCount]);

  return (
    <div className="p-6 pt-12 space-y-8 animate-in fade-in duration-700 pb-24 overflow-y-auto h-full max-w-md mx-auto no-scrollbar">
      <header className="flex justify-between items-center px-2">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-[#000]'}`}>Activity</h1>
          <p className="text-orange-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Spiritual Progress</p>
        </div>
        <button 
          onClick={() => confirm("Delete all activity logs?") && onReset()}
          className={`p-3 rounded-2xl transition-all active:scale-90 ${darkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400 shadow-sm'}`}
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Main Insights Card */}
      <div className={`p-8 rounded-[2.5rem] border shadow-2xl transition-all ${darkMode ? 'bg-slate-900 border-slate-800 shadow-black/40' : 'bg-white border-slate-100 shadow-slate-200/40'}`}>
        <div className="flex justify-between items-start mb-8">
           <div className="space-y-1">
             <p className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Chants</p>
             <h2 className={`text-5xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-[#000]'}`}>{lifetimeCount.toLocaleString()}</h2>
           </div>
           <div className={`p-3 rounded-2xl ${darkMode ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
             <TrendingUp className="text-orange-500" size={24} />
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50 dark:border-slate-800/50">
           <div className="space-y-1">
             <p className={`text-[9px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Malas</p>
             <p className={`text-2xl font-black ${darkMode ? 'text-slate-200' : 'text-[#000]'}`}>{totalMalas}</p>
           </div>
           <div className="space-y-1">
             <p className={`text-[9px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Avg/Session</p>
             <p className={`text-2xl font-black ${darkMode ? 'text-slate-200' : 'text-[#000]'}`}>{stats.avg}</p>
           </div>
        </div>
      </div>

      {/* Segmented Control */}
      <div className={`p-1.5 rounded-2xl flex items-center transition-all ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100'}`}>
        {(['Day', 'Week', 'Month', 'Year'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${period === p 
              ? (darkMode ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-[#000] shadow-sm') 
              : 'text-slate-400 hover:text-slate-500'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Analytics Graph */}
      <div className={`p-6 rounded-[2.5rem] border transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: darkMode ? '#475569' : '#000', fontSize: 10, fontWeight: '900'}} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: darkMode ? '#475569' : '#94a3b8', fontSize: 9}} 
              />
              <Tooltip 
                cursor={{fill: darkMode ? '#1e293b' : '#f8fafc', radius: 8}}
                contentStyle={{
                  borderRadius: '20px', 
                  backgroundColor: darkMode ? '#0f172a' : '#fff',
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  fontWeight: '900',
                  fontSize: '12px',
                  color: darkMode ? '#fff' : '#000'
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={period === 'Year' ? 12 : 18}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? "#fb923c" : (darkMode ? "#1e293b" : "#f1f5f9")} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Recent Logs</h3>
           <button className="text-[10px] font-bold text-orange-500 flex items-center gap-1">View All <ChevronRight size={12} /></button>
        </div>
        <div className="space-y-3">
          {sessions.slice(0, 5).map(s => (
            <div key={s.id} className={`p-5 rounded-[2rem] border flex items-center justify-between transition-all duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${darkMode ? 'bg-slate-950 text-orange-500' : 'bg-orange-50 text-orange-500'}`}>
                  {new Date(s.startTime).getDate()}
                </div>
                <div>
                  <p className={`text-sm font-black tracking-tight ${darkMode ? 'text-slate-200' : 'text-[#000]'}`}>Session log</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(s.startTime).toLocaleDateString([], { month: 'short' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-orange-500">+{s.count}</p>
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className={`text-center py-12 rounded-[2rem] border border-dashed ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <History size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No activity history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatsScreenProps {
  sessions: Session[];
  totalMalas: number;
  onReset: () => void;
  darkMode: boolean;
}

const MetricRow: React.FC<{ icon: React.ReactNode, label: string, value: string, darkMode: boolean }> = ({ icon, label, value, darkMode }) => (
  <div className="flex justify-between items-center p-5">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400'}`}>{icon}</div>
      <span className={`text-[11px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
    </div>
    <span className={`text-sm font-black ${darkMode ? 'text-slate-100' : 'text-[#000]'}`}>{value}</span>
  </div>
);

export default StatsScreen;
