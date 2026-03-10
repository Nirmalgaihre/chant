import React, { useState } from 'react';
import { HistoryEntry, UserSettings } from '../types';
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
import { TrendingUp, Calendar } from 'lucide-react';

interface StatsViewProps {
  history: HistoryEntry[];
  settings: UserSettings;
}

const StatsView: React.FC<StatsViewProps> = ({ history, settings }) => {
  const [days, setDays] = useState(7);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const lastNDays = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = lastNDays.map((date) => {
    const entry = history.find((h) => h.date === date);
    return {
      date: date.split('-').slice(1).join('/'),
      chants: entry ? entry.chants : 0,
      fullDate: date,
    };
  });

  const totalChants = history.reduce((sum, h) => sum + h.chants, 0);
  const totalMalas = Math.floor(totalChants / settings.target);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const todayChants = history.find((h) => h.date === today)?.chants || 0;
  const yesterdayChants = history.find((h) => h.date === yesterday)?.chants || 0;
  const selectedDateChants = history.find((h) => h.date === selectedDate)?.chants || 0;

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32">
      <header className="mb-8">
        <h2 className="text-2xl font-serif text-amber-100 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-amber-400" />
          तथ्याङ्क
        </h2>
        <p className="text-zinc-500 text-sm">तपाईंको आध्यात्मिक प्रगति</p>
      </header>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">आज (Today)</p>
          <p className="text-xl font-bold text-amber-100">{todayChants.toLocaleString()}</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">हिजो (Yesterday)</p>
          <p className="text-xl font-bold text-amber-100">{yesterdayChants.toLocaleString()}</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 col-span-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">कुल जप (Lifetime)</p>
            <p className="text-2xl font-bold text-amber-400">{totalChants.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">कुल माला</p>
            <p className="text-2xl font-bold text-amber-400">{totalMalas.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <section className="mb-10">
        <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          मिति अनुसार हेर्नुहोस्
        </h3>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 flex-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">{selectedDate} को जप:</span>
            <span className="text-lg font-bold text-amber-400">
              {selectedDateChants.toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* Bar Chart – last N days */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            जप चार्ट
          </h3>

          <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5 overflow-x-auto no-scrollbar">
            {[7, 15, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all whitespace-nowrap ${
                  days === d
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {d} दिन
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full bg-white/5 rounded-2xl p-4 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 10 }}
                dy={10}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#fbbf24' }}
              />
              <Bar dataKey="chants" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.chants > 0 ? '#d97706' : '#1f2937'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default StatsView;