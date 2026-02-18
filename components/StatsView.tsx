import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChevronRight, History } from 'lucide-react';

interface HistoryEntry {
  date: string;
  chants: number;
  malas: number;
  startTime?: number;
}

interface StatsScreenProps {
  totalMalas: number;
  history: HistoryEntry[];
  mantra: string;
  darkMode?: boolean;
}

const StatsScreen: React.FC<StatsScreenProps> = ({
  totalMalas = 0,
  history = [],
  mantra,
  darkMode = false,
}) => {
  const [liveTodayChants, setLiveTodayChants] = useState(0);

  // Real-time polling of today's chants
  useEffect(() => {
    const updateToday = () => {
      const stored = localStorage.getItem('mantraSession');
      if (!stored) {
        setLiveTodayChants(0);
        return;
      }
      try {
        const data = JSON.parse(stored);
        const todayStr = new Date().toISOString().split('T')[0];
        if (data.date === todayStr) {
          setLiveTodayChants(data.todayChants ?? 0);
        } else {
          setLiveTodayChants(0);
        }
      } catch {
        setLiveTodayChants(0);
      }
    };

    updateToday(); // initial
    const interval = setInterval(updateToday, 2200); // ~every 2.2 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    let last7 = liveTodayChants;
    let last15 = liveTodayChants;
    let last30 = liveTodayChants;
    let last90 = liveTodayChants;
    let yearly = 0;
    let lifetime = totalMalas;

    const oneDayMs = 86400000;
    const days7Start  = new Date(now.getTime() - 6 * oneDayMs).toISOString().split('T')[0];
    const days15Start = new Date(now.getTime() - 14 * oneDayMs).toISOString().split('T')[0];
    const days30Start = new Date(now.getTime() - 29 * oneDayMs).toISOString().split('T')[0];
    const days90Start = new Date(now.getTime() - 89 * oneDayMs).toISOString().split('T')[0];
    const yearStart   = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];

    history.forEach(entry => {
      if (entry.date < today) {
        if (entry.date >= days7Start)  last7  += entry.chants;
        if (entry.date >= days15Start) last15 += entry.chants;
        if (entry.date >= days30Start) last30 += entry.chants;
        if (entry.date >= days90Start) last90 += entry.chants;
        if (entry.date >= yearStart)   yearly += entry.malas;
      }
    });

    return {
      todayCount: liveTodayChants,
      last7Days: last7,
      last15Days: last15,
      last30Days: last30,
      last90Days: last90,
      yearlyTotal: yearly,
      lifetimeTotal: lifetime,
    };
  }, [liveTodayChants, totalMalas, history]);

  const [range, setRange] = useState<'week' | 'month' | '6months' | 'year'>('week');

  const chartData = useMemo(() => {
    switch (range) {
      case 'week':   return [
        { label: 'Today',   value: stats.todayCount },
        { label: '7 Days',  value: stats.last7Days },
      ];
      case 'month':  return [
        { label: '15 Days', value: stats.last15Days },
        { label: '30 Days', value: stats.last30Days },
      ];
      case '6months': return [
        { label: '90 Days', value: stats.last90Days },
      ];
      case 'year':   return [
        { label: 'This Year', value: stats.yearlyTotal },
        { label: 'Lifetime',  value: stats.lifetimeTotal },
      ];
      default: return [];
    }
  }, [range, stats]);

  const recentDays = useMemo(() => {
    return history
      .filter(h => h.chants > 0)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
      .map(h => ({
        id: h.date,
        startTime: h.startTime || new Date(h.date).getTime(),
        count: h.chants,
      }));
  }, [history]);

  return (
    <div className={`min-h-screen p-6 pt-10 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-md mx-auto space-y-8">

        {/* Mantra Title */}
        <div className="text-center">
          <p className="text-orange-500 text-xs uppercase tracking-widest font-semibold mb-1">
            Your Mantra
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">{mantra}</h1>
        </div>

        {/* Live Today */}
        <div className="text-center bg-gradient-to-br from-orange-900/30 to-amber-900/20 rounded-2xl p-6 border border-orange-500/20">
          <p className="text-sm uppercase tracking-wider text-orange-400 mb-1">Live Today</p>
          <div className="text-5xl md:text-6xl font-black text-orange-500">
            {liveTodayChants.toLocaleString()}
            <span className="text-2xl font-normal text-gray-400 ml-3">chants</span>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex gap-2 flex-wrap">
          {['week', 'month', '6months', 'year'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r as any)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                range === r
                  ? 'bg-orange-600 text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {r === 'week' ? 'Week' : r === 'month' ? 'Month' : r === '6months' ? '90 Days' : 'Year'}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className={`p-5 rounded-3xl border shadow-xl ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <h2 className="text-xs uppercase font-black tracking-widest mb-4 text-center opacity-80">
            Progress Overview
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: darkMode ? '#94a3b8' : '#475569' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#475569' }} />
                <Tooltip cursor={{ fill: darkMode ? 'rgba(30,41,59,0.4)' : 'rgba(241,245,249,0.6)' }} />
                <Bar dataKey="value" radius={[8,8,0,0]} barSize={50} minPointSize={6}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={chartData[i].value > 0 ? '#f97316' : (darkMode ? '#1e293b' : '#e2e8f0')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          {chartData.map((item, i) => (
            <div
              key={i}
              className={`flex justify-between items-center p-5 rounded-2xl border ${
                darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <span className="text-sm font-black uppercase tracking-wider opacity-80">{item.label}</span>
              <span className="text-2xl font-black text-orange-500">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Recent Days */}
        <div className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h3 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Recent Days
            </h3>
            <button className="text-xs font-bold text-orange-500 flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>

          {recentDays.length > 0 ? (
            <div className="space-y-3">
              {recentDays.map(day => (
                <div
                  key={day.id}
                  className={`p-4 rounded-2xl border flex justify-between items-center ${
                    darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                  }`}
                >
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {new Date(day.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(day.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-xl font-black text-orange-500">+{day.count.toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-14 rounded-2xl border border-dashed ${
              darkMode ? 'border-gray-800 text-gray-600' : 'border-gray-300 text-gray-400'
            }`}>
              <History className="mx-auto mb-3 opacity-60" size={32} />
              <p className="text-sm font-medium">No chanting recorded yet</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StatsScreen;