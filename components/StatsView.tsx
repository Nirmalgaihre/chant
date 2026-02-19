// src/components/StatsScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';

interface StatsScreenProps {
  mantra: string;
  target?: number;
}

const STORAGE_KEY_SESSION = 'mantraSession';
const STORAGE_KEY_HISTORY = 'mantraHistory';

const StatsScreen: React.FC<StatsScreenProps> = ({ mantra, target = 108 }) => {
  const [range, setRange] = useState<'today' | '7d' | '30d' | '90d' | 'year'>('today');
  const [todayChants, setTodayChants] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const refresh = () => {
      const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
      if (sessionStr) {
        try {
          const data = JSON.parse(sessionStr);
          const currentDay = new Date().toISOString().split('T')[0];
          if (data.date === currentDay) {
            setTodayChants(data.todayChants || 0);
          } else {
            setTodayChants(0);
          }
        } catch {}
      }

      const historyStr = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (historyStr) {
        try {
          setHistory(JSON.parse(historyStr));
        } catch {}
      }
    };

    refresh();
    const timer = setInterval(refresh, 3000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    let chants = todayChants;
    let malas = Math.floor(todayChants / target);
    let label = 'Today';
    let daysCount = 1;

    let fromDate: string | undefined;

    switch (range) {
      case '7d':
        fromDate = new Date(now.getTime() - 6 * 86400000).toISOString().split('T')[0];
        label = 'Last 7 days';
        daysCount = 7;
        break;
      case '30d':
        fromDate = new Date(now.getTime() - 29 * 86400000).toISOString().split('T')[0];
        label = 'Last 30 days';
        daysCount = 30;
        break;
      case '90d':
        fromDate = new Date(now.getTime() - 89 * 86400000).toISOString().split('T')[0];
        label = 'Last 90 days';
        daysCount = 90;
        break;
      case 'year':
        fromDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        label = 'This year';
        daysCount = Math.ceil((Date.now() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000);
        break;
      default:
        break;
    }

    if (fromDate) {
      history.forEach(entry => {
        if (entry.date >= fromDate && entry.date < todayStr) {
          chants += entry.chants || 0;
          malas += entry.malas || 0;
        }
      });
    }

    return { chants, malas, label, daysCount };
  }, [range, todayChants, history, target]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-5 pt-12 pb-20">
      <div className="max-w-md mx-auto space-y-8">

        <div className="text-center">
          <p className="text-orange-500 text-xs uppercase tracking-widest font-semibold">
            Mantra Japa
          </p>
          <h1 className="text-3xl font-bold Hindi-font mt-1">{mantra}</h1>
        </div>

        <div className="bg-zinc-900/70 rounded-3xl p-8 border border-zinc-800 text-center shadow-xl">
          <p className="text-orange-400 uppercase text-sm tracking-wider mb-4 font-medium">
            {stats.label}
          </p>
          <div className="text-7xl font-black text-orange-500">
            {stats.chants.toLocaleString()}
          </div>
          <p className="text-xl text-zinc-400 mt-2">chants</p>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <div className="text-5xl font-bold text-amber-400">
              {stats.malas.toLocaleString()}
            </div>
            <p className="text-zinc-500 mt-1">malas completed</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d',    label: '7 days' },
            { id: '30d',   label: '30 days' },
            { id: '90d',   label: '90 days' },
            { id: 'year',  label: 'Year' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setRange(btn.id as any)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium transition-all
                ${range === btn.id
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700'}
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="text-center text-zinc-400 text-sm pt-4">
          ≈ {(stats.chants / stats.daysCount).toFixed(0)} chants/day
        </div>

      </div>
    </div>
  );
};

export default StatsScreen;