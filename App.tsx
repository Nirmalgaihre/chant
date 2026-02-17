
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Home, BarChart2, Settings as SettingsIcon, Info } from 'lucide-react';
import { AppState, Page, Session } from './types';
import { DEFAULT_MANTRAS, STORAGE_KEY } from './constants';
import HomeScreen from './components/HomeScreen';
import StatsScreen from './components/StatsScreen';
import SettingsScreen from './components/SettingsScreen';
import AboutScreen from './components/AboutScreen';
import SplashScreen from './components/SplashScreen';
import Onesignal from 'react-onesignal';

const = App () => {
  useEffect (() => {
    Onesignal.init{{
      appId: "16948a73-f313-4e1e-8796-32a94707cea8",
      notifyButton: {
        enable: true
      }
    }}; 
  }, []);
  return <div> Your react app with onesignal</div>
}


const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activePage, setActivePage] = useState<Page>('home');
  const [votedInCurrentSession, setVotedInCurrentSession] = useState(false);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.stats) parsed.stats = { likes: 124, dislikes: 2 };
      return parsed;
    }
    return {
      currentCount: 0,
      totalMalas: 0,
      selectedMantraId: '1',
      mantras: DEFAULT_MANTRAS,
      sessions: [],
      targetCount: 108,
      stats: { likes: 124, dislikes: 2 },
      settings: {
        sound: true,
        vibration: true,
        darkMode: false,
      },
    };
  });

  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const playBell = useCallback(() => {
    if (!state.settings.sound) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime); 
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.error("Audio failed", e);
    }
  }, [state.settings.sound]);

  useEffect(() => {
    if (activePage === 'home' && !currentSession && !showSplash) {
      const newSession: Session = {
        id: Date.now().toString(),
        startTime: Date.now(),
        count: 0,
        mantraId: state.selectedMantraId,
        targetCount: state.targetCount,
      };
      setCurrentSession(newSession);
    }
  }, [activePage, currentSession, state.selectedMantraId, state.targetCount, showSplash]);

  const handleIncrement = useCallback(() => {
    setState(prev => {
      let nextCount = prev.currentCount + 1;
      let nextTotalMalas = prev.totalMalas;

      if (nextCount >= prev.targetCount) {
        nextCount = 0;
        nextTotalMalas += 1;
        playBell();
        if (prev.settings.vibration) {
          navigator.vibrate([100, 50, 100]);
        }
      } else {
        if (prev.settings.vibration) {
          navigator.vibrate(10);
        }
      }

      return {
        ...prev,
        currentCount: nextCount,
        totalMalas: nextTotalMalas,
      };
    });

    if (currentSession) {
      setCurrentSession(prev => prev ? ({ ...prev, count: prev.count + 1 }) : null);
    }
  }, [currentSession, playBell]);

  const endSession = useCallback(() => {
    if (currentSession && currentSession.count > 0) {
      const completedSession = { ...currentSession, endTime: Date.now() };
      setState(prev => ({
        ...prev,
        sessions: [completedSession, ...prev.sessions]
      }));
    }
    setCurrentSession(null);
  }, [currentSession]);

  const activeMantra = useMemo(() => 
    state.mantras.find(m => m.id === state.selectedMantraId) || state.mantras[0],
    [state.mantras, state.selectedMantraId]
  );

  const todayStats = useMemo(() => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const completedToday = state.sessions.filter(s => s.startTime >= todayStart);
    const countCompleted = completedToday.reduce((acc, s) => acc + s.count, 0);
    const totalToday = countCompleted + (currentSession?.count || 0);
    const malasToday = Math.floor(totalToday / state.targetCount);
    
    return {
      total: totalToday,
      malas: malasToday
    };
  }, [state.sessions, currentSession, state.targetCount]);

  const handleVote = (type: 'like' | 'dislike') => {
    if (votedInCurrentSession) return;
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [type === 'like' ? 'likes' : 'dislikes']: prev.stats[type === 'like' ? 'likes' : 'dislikes'] + 1
      }
    }));
    setVotedInCurrentSession(true);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomeScreen count={state.currentCount} target={state.targetCount} totalMalas={state.totalMalas} todayTotal={todayStats.total} todayMalas={todayStats.malas} mantra={activeMantra.text} onIncrement={handleIncrement} darkMode={state.settings.darkMode} />;
      case 'stats':
        return <StatsScreen sessions={state.sessions} totalMalas={state.totalMalas} onReset={() => setState(p => ({ ...p, sessions: [], totalMalas: 0 }))} darkMode={state.settings.darkMode} />;
      case 'settings':
        return <SettingsScreen state={state} setState={setState} onEndSession={endSession} />;
      case 'about':
        return <AboutScreen likes={state.stats.likes} dislikes={state.stats.dislikes} onVote={handleVote} hasVoted={votedInCurrentSession} darkMode={state.settings.darkMode} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${state.settings.darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F8F9FA] text-[#000]'}`}>
      <main className="flex-1 pb-24 h-screen overflow-hidden">
        {renderPage()}
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around px-6 z-50 transition-colors duration-500 ${state.settings.darkMode ? 'bg-slate-900 border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]' : 'bg-white border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]'}`}>
        <NavButton active={activePage === 'home'} onClick={() => setActivePage('home')} icon={<Home size={24} />} label="Home" darkMode={state.settings.darkMode} />
        <NavButton active={activePage === 'stats'} onClick={() => setActivePage('stats')} icon={<BarChart2 size={24} />} label="Stats" darkMode={state.settings.darkMode} />
        <NavButton active={activePage === 'settings'} onClick={() => setActivePage('settings')} icon={<SettingsIcon size={24} />} label="Settings" darkMode={state.settings.darkMode} />
        <NavButton active={activePage === 'about'} onClick={() => setActivePage('about')} icon={<Info size={24} />} label="About" darkMode={state.settings.darkMode} />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  darkMode: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label, darkMode }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${active ? 'text-orange-500 scale-110' : darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
    {icon}
    <span className={`text-[10px] font-black uppercase tracking-widest ${active && !darkMode ? 'text-[#000]' : ''}`}>{label}</span>
  </button>
);

export default App;
