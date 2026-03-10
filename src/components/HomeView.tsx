import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';
import { Mantra, SessionData, HistoryEntry, UserSettings } from '../types';

const SmoothNumber = ({ value, className }: { value: number, className?: string }) => {
  const springValue = useSpring(value, { stiffness: 120, damping: 20 });
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return <motion.span className={className}>{displayValue}</motion.span>;
};

interface HomeViewProps {
  settings: UserSettings;
  mantra: Mantra;
  onCountUpdate?: (total: number) => void;
}

const STORAGE_KEY_CURRENT = 'mantraSession';
const STORAGE_KEY_HISTORY = 'mantraHistory';

const HomeView: React.FC<HomeViewProps> = ({ settings, mantra, onCountUpdate }) => {
  const target = settings.target;
  const [count, setCount] = useState(0);
  const [todayChants, setTodayChants] = useState(0);
  const [todayMalas, setTodayMalas] = useState(0);
  const [totalChants, setTotalChants] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const tapLock = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const storedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT);
    let current: SessionData | null = null;
    if (storedCurrent) {
      try {
        current = JSON.parse(storedCurrent);
      } catch {}
    }

    const storedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    const history: HistoryEntry[] = storedHistory ? JSON.parse(storedHistory) : [];

    const lifetimeChants = history.reduce((sum, day) => sum + (day.chants || 0), 0);
    setTotalChants(lifetimeChants);

    if (current && current.date === today) {
      setTodayChants(current.todayChants || 0);
      setTodayMalas(Math.floor((current.todayChants || 0) / target));
      setCount((current.todayChants || 0) % target);
    } else {
      setTodayChants(0);
      setTodayMalas(0);
      setCount(0);
    }
  }, [target, today]);

  const saveData = (newCount: number, newTodayChants: number, newTotalChants: number) => {
    const currentSession: SessionData = {
      date: today,
      todayChants: newTodayChants,
      totalChants: newTotalChants,
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
      history[dayIndex] = { ...history[dayIndex], chants: newTodayChants };
    } else if (newTodayChants > 0) {
      history.push({ date: today, chants: newTodayChants, startTime: Date.now() });
    }

    history = history.slice(-730);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));

    // Update total chanting time every 10 counts
    if (newTodayChants % 10 === 0) {
      const storedTotalTime = localStorage.getItem('total_chant_time');
      const totalTime = storedTotalTime ? parseInt(storedTotalTime) : 0;
      localStorage.setItem('total_chant_time', (totalTime + 10).toString());
    }

    setCount(newCount);
    setTodayChants(newTodayChants);
    setTodayMalas(Math.floor(newTodayChants / target));
    setTotalChants(newTotalChants);
    onCountUpdate?.(newTotalChants);
  };

  const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
    if (tapLock.current) return;
    tapLock.current = true;

    const nextCount = (count + 1) > target ? 1 : count + 1;
    const newTodayChants = todayChants + 1;
    const newTotalChants = totalChants + 1;

    // Sound and Haptic
    const isMalaComplete = newTodayChants % target === 0;
    
    if (isMalaComplete && settings.completionSoundEnabled) {
      // Use the default flute sound for mala completion
      const soundUrl = 'https://nirmalgaihre.com.np/images/krishna_flute.mp3';
      const audio = new Audio(soundUrl);
      audio.volume = 0.6;
      audio.play().catch(() => {});
    }

    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(15);
    }

    if (newTodayChants % target === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3800);
      if (settings.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]); // Triple pulse for completion
      }
    }

    // Add floating mantra at click position
    const clickId = Date.now() + Math.random();
    setClickEffects(prev => [...prev, { id: clickId, x: e.clientX, y: e.clientY, text: mantra.text }]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(eff => eff.id !== clickId));
    }, 1500);

    saveData(nextCount, newTodayChants, newTotalChants);
    setTimeout(() => { tapLock.current = false; }, 80);
  };

  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const progress = count / target;
  const offset = circumference - progress * circumference;
  const displayCount = count === 0 && todayChants > 0 && todayChants % target === 0 ? target : count;

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center select-none touch-none overflow-hidden relative"
      onPointerDown={handleTap}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.05)_0%,transparent_65%)]" />

      <AnimatePresence>
        {clickEffects.map((eff) => (
          <motion.div
            key={eff.id}
            initial={{ opacity: 1, x: eff.x, y: eff.y, scale: 0.8 }}
            animate={{ 
              opacity: 0,
              y: eff.y - 150,
              scale: 1.2,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed pointer-events-none z-[60] text-amber-200/90 font-medium text-xl select-none Hindi-font whitespace-nowrap"
            style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
          >
            {eff.text}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="text-center mb-8 pointer-events-none z-10">
        <h3 className="text-[10px] uppercase tracking-[0.2em] mb-2 font-light text-amber-200/40 Hindi-font">
          आज भन्यो भोलि भन्यो जिन्दगि यो बित्यो नि हरि भजन कहिले नभुल !!
        </h3>
        <h1 className="text-2xl md:text-3xl font-serif mb-1 text-amber-100/90 leading-relaxed max-w-md mx-auto px-3 Hindi-font">
          जपौ — {mantra.text}
        </h1>
      </div>

      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center mb-12 pointer-events-none z-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth="8"
            strokeDasharray="4 8"
            opacity={0.2}
          />
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="url(#progressGrad)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className=""
          />
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={displayCount}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0, position: 'absolute' }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className={`text-7xl md:text-8xl font-black tracking-tighter tabular-nums ${
                showCelebration
                  ? 'text-amber-200 drop-shadow-[0_0_28px_rgba(245,158,11,0.65)]'
                  : 'text-white drop-shadow-md'
              }`}
            >
              <SmoothNumber value={displayCount} />
            </motion.div>
          </AnimatePresence>
          <span className="text-sm text-zinc-500 font-medium mt-1 tracking-widest uppercase">
            / {target}
          </span>
        </div>

        {showCelebration && (
          <div
            className="
              absolute -top-20 left-1/2 -translate-x-1/2
              text-xl md:text-2xl font-medium text-amber-200/95
              tracking-wide drop-shadow-[0_4px_20px_rgba(245,158,11,0.6)]
              animate-[celebrationAppear_3.8s_ease-out_forwards]
              pointer-events-none z-20 whitespace-nowrap Hindi-font
            "
          >
            {todayMalas} माला पूरा भयो
          </div>
        )}
      </div>

      <div className="w-full max-w-sm grid grid-cols-3 gap-4 text-center pointer-events-none mb-10 z-10 px-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/5">
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1 Hindi-font">आज जप</p>
          <p className="text-xl font-bold text-amber-300">
            <SmoothNumber value={todayChants} />
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/5">
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1 Hindi-font">आज माला</p>
          <p className="text-xl font-bold text-amber-400">
            <SmoothNumber value={todayMalas} />
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/5">
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1 Hindi-font">कुल जप</p>
          <p className="text-xl font-bold text-amber-200">
            <SmoothNumber value={totalChants} />
          </p>
        </div>
      </div>

      <p className="text-xs text-zinc-600 font-light tracking-[0.2em] uppercase pointer-events-none mt-5 z-10">
        Tap anywhere to chant • जप गर्न ट्याप गर्नुहोस्
      </p>
    </div>
  );
};

export default HomeView;
