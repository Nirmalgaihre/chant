// src/components/HomeView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Mantra } from '../types'; // adjust path if needed

interface HomeViewProps {
  target: number;
  mantra: Mantra;
}

interface SessionData {
  date: string;
  todayChants: number;
  todayMalas: number;
  totalMalas: number;
}

interface HistoryEntry {
  date: string;           // YYYY-MM-DD
  chants: number;
  malas: number;
  startTime?: number;     // timestamp when first chant happened that day
}

const STORAGE_KEY_CURRENT = 'mantraSession';
const STORAGE_KEY_HISTORY = 'mantraHistory';

const HomeView: React.FC<HomeViewProps> = ({ target, mantra }) => {
  const [count, setCount] = useState(0);
  const [todayChants, setTodayChants] = useState(0);
  const [todayMalas, setTodayMalas] = useState(0);
  const [totalMalas, setTotalMalas] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const tapLock = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const today = new Date().toISOString().split('T')[0];

  // Audio setup
  useEffect(() => {
    audioRef.current = new Audio('https://nirmalgaihre.com.np/images/krishna_flute.mp3');
    audioRef.current.preload = 'auto';
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Load saved data
  useEffect(() => {
    const storedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT);
    let current: SessionData | null = null;
    if (storedCurrent) {
      try {
        current = JSON.parse(storedCurrent);
      } catch (err) {
        console.warn('Invalid current session data', err);
      }
    }

    const storedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    const history: HistoryEntry[] = storedHistory ? JSON.parse(storedHistory) : [];

    if (current && current.date === today) {
      setTodayChants(current.todayChants || 0);
      setTodayMalas(current.todayMalas || 0);
      setTotalMalas(current.totalMalas || 0);
      setCount(current.todayChants % target);
    } else {
      setTodayChants(0);
      setTodayMalas(0);
      setCount(0);
      const lifetime = history.reduce((sum, day) => sum + (day.malas || 0), 0);
      setTotalMalas(lifetime);
    }
  }, [target, today]);

  const saveData = (
    newCount: number,
    newTodayChants: number,
    newTodayMalas: number,
    newTotalMalas: number
  ) => {
    const currentSession: SessionData = {
      date: today,
      todayChants: newTodayChants,
      todayMalas: newTodayMalas,
      totalMalas: newTotalMalas,
    };
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentSession));

    let history: HistoryEntry[] = [];
    const storedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (storedHistory) {
      try {
        history = JSON.parse(storedHistory);
      } catch {}
    }

    const dayIndex = history.findIndex((h) => h.date === today);
    if (dayIndex >= 0) {
      history[dayIndex] = { ...history[dayIndex], chants: newTodayChants, malas: newTodayMalas };
    } else if (newTodayChants > 0 || newTodayMalas > 0) {
      history.push({ date: today, chants: newTodayChants, malas: newTodayMalas, startTime: Date.now() });
    }

    history = history.slice(-730); // keep last ~2 years
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));

    setCount(newCount);
    setTodayChants(newTodayChants);
    setTodayMalas(newTodayMalas);
    setTotalMalas(newTotalMalas);
  };

  const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (tapLock.current) return;
    tapLock.current = true;

    // Floating text
    const x = e.clientX ?? window.innerWidth / 2;
    const y = e.clientY ?? window.innerHeight / 2;
    const id = Date.now();
    setFloatingTexts((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setFloatingTexts((prev) => prev.filter((t) => t.id !== id)), 1800);

    // Update counters
    const newCount = count + 1;
    let newTodayChants = todayChants + 1;
    let newTodayMalas = todayMalas;
    let newTotalMalas = totalMalas;
    let celebrationTriggered = false;

    if (newCount % target === 0 && newCount > 0) {
      celebrationTriggered = true;
      newTodayMalas += 1;
      newTotalMalas += 1;
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.warn('Audio playback prevented:', err);
        });
      }
    }

    saveData(newCount, newTodayChants, newTodayMalas, newTotalMalas);

    setTimeout(() => { tapLock.current = false; }, 60);
  };

  // Progress circle calculation
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = (count % target) / target;
  const offset = circumference - progress * circumference;

  const displayCount = count % target === 0 && count > 0 ? target : count % target;

  return (
    <div
      className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center pt-8 px-6 select-none touch-none overflow-hidden relative"
      onPointerDown={handleTap}
    >
      {/* Header */}
      <div className="text-center mb-8 h-20 flex flex-col justify-end pointer-events-none">
        <h3 className="text-xs font-semibold uppercase mb-1 tracking-wide text-white/90">
          आज भन्यो भोलि भन्यो जिन्दगि यो बित्यो नि हरि भजन कहिले नभुल !!
        </h3>
        <h1 className="text-xl md:text-2xl font-bold Hindi-font px-4 leading-relaxed line-clamp-2 max-w-xs mx-auto">
          जपौ - {mantra.text}
        </h1>
      </div>

      {/* Progress Circle with count inside */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center mb-12 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Background ring */}
          <circle
            className="text-zinc-800"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
          />
          {/* Progress ring */}
          <circle
            className={`circular-progress transition-all duration-400 ease-out ${
              showCelebration ? 'text-amber-500 glow-active stroke-[12px]' : 'text-orange-500'
            }`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
          />
        </svg>

        {/* Centered count */}
        <div className="absolute flex flex-col items-center pointer-events-none">
          <span
            className={`text-6xl md:text-7xl font-black transition-all duration-500 ${
              showCelebration ? 'scale-125 text-amber-300 glow-active' : 'text-white'
            }`}
          >
            {displayCount}
          </span>
          <span className="text-zinc-500 text-sm mt-1 font-medium">
            / {target}
          </span>
        </div>

        {/* Celebration banner */}
        {showCelebration && (
          <div className="absolute -top-14 bg-amber-900/60 text-amber-100 px-6 py-2.5 rounded-full text-sm font-bold shadow-xl animate-bounce backdrop-blur-md border border-amber-700/50">
            ✨ MALA COMPLETE ✨
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="w-full max-w-xs text-center space-y-5 pointer-events-none">
        <p className="text-sm text-zinc-400 font-semibold uppercase tracking-wide">
          Today Chants : {todayChants.toString().padStart(3, '0')}
        </p>
        <p className="text-sm text-zinc-400 font-semibold uppercase tracking-wide">
          Today Malas  : {todayMalas.toString().padStart(2, '0')}
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Lifetime Malas
          </span>
          <span className={`${showCelebration ? 'animate-[shake_0.6s_infinite]' : ''} text-3xl`}>
            📿
          </span>
        </div>
        <p className="text-6xl md:text-7xl font-black text-orange-500 tracking-tighter">
          {totalMalas.toLocaleString()}
        </p>
      </div>

      <p className="mt-12 text-zinc-600 text-xs uppercase font-medium tracking-wider pointer-events-none">
        Tap anywhere to chant
      </p>

      {/* Floating mantra texts */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className="mantra-float absolute text-orange-400 font-bold Hindi-font text-xl md:text-2xl whitespace-pre-wrap text-center opacity-90 pointer-events-none max-w-[90vw] leading-relaxed drop-shadow-lg z-50"
          style={{
            left: `${ft.x}px`,
            top: `${ft.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {mantra.text}
        </div>
      ))}

      {/* Animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
        .mantra-float {
          animation: floatUp 1.8s ease-out forwards;
        }
        @keyframes floatUp {
          0%   { opacity: 0.9;  transform: translate(-50%, -30%) scale(0.95); }
          40%  { opacity: 1;    transform: translate(-50%, -160%) scale(1.08); }
          100% { opacity: 0;    transform: translate(-50%, -400%) scale(1.15); }
        }
        .glow-active {
          filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.7));
        }
        .circular-progress {
          transition: stroke 0.4s ease-out, stroke-width 0.4s ease-out, filter 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomeView;