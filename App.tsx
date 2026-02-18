
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mantra, Session, UserSettings, ViewType, Stats } from './types';
import { DEFAULT_MANTRAS, DEFAULT_SETTINGS, FLUTE_SOUND_URL } from './constants';
import HomeView from './components/HomeView';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';
import AboutView from './components/AboutView';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<ViewType>('home');
  const [mantras, setMantras] = useState<Mantra[]>(() => {
    const saved = localStorage.getItem('naamjap_mantras');
    return saved ? JSON.parse(saved) : DEFAULT_MANTRAS;
  });
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('naamjap_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('naamjap_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem('naamjap_stats');
    return saved ? JSON.parse(saved) : { lifetimeTotal: 0, totalMalas: 0 };
  });

  // Current session tracking
  const [currentSessionCount, setCurrentSessionCount] = useState(0);
  const sessionStartTime = useRef<number>(Date.now());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlocked = useRef(false);

  // Persistence Effects
  useEffect(() => localStorage.setItem('naamjap_mantras', JSON.stringify(mantras)), [mantras]);
  useEffect(() => localStorage.setItem('naamjap_settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('naamjap_sessions', JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem('naamjap_stats', JSON.stringify(stats)), [stats]);

  useEffect(() => {
    // Preload audio
    const audio = new Audio(FLUTE_SOUND_URL);
    audio.preload = 'auto';
    audioRef.current = audio;
  }, []);

  const handleIncrement = useCallback(() => {
    // 1. Try to unlock audio context on the very first interaction
    if (!audioUnlocked.current && settings.soundEnabled && audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current!.pause();
        audioRef.current!.currentTime = 0;
        audioUnlocked.current = true;
      }).catch(() => {
        // Still blocked, will try again next tap
      });
    }

    const nextCount = currentSessionCount + 1;
    setCurrentSessionCount(nextCount);
    
    // Update lifetime total
    setStats(s => ({ ...s, lifetimeTotal: s.lifetimeTotal + 1 }));

    // Check for Mala completion (Every 108 or target)
    if (nextCount > 0 && nextCount % settings.targetCount === 0) {
      // Increment Mala count
      setStats(s => ({ ...s, totalMalas: s.totalMalas + 1 }));

      // Play Sound (Directly in event handler for browser compatibility)
      if (settings.soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.warn("Audio playback failed:", e));
      }

      // Mala completion vibration
      if (settings.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } else {
      // Regular tap vibration
      if (settings.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  }, [currentSessionCount, settings]);

  const saveCurrentSession = useCallback(() => {
    if (currentSessionCount > 0) {
      const newSession: Session = {
        id: Date.now().toString(),
        startTime: sessionStartTime.current,
        endTime: Date.now(),
        counts: currentSessionCount,
        mantraId: settings.selectedMantraId
      };
      setSessions(prev => [...prev, newSession]);
    }
    setCurrentSessionCount(0);
    sessionStartTime.current = Date.now();
  }, [currentSessionCount, settings.selectedMantraId]);

  const resetSession = () => {
    setCurrentSessionCount(0);
    sessionStartTime.current = Date.now();
  };

  const handleResetStats = () => {
    if (confirm("Are you sure you want to reset all stats and sessions? This cannot be undone.")) {
      setStats({ lifetimeTotal: 0, totalMalas: 0 });
      setSessions([]);
      setCurrentSessionCount(0);
      sessionStartTime.current = Date.now();
    }
  };

  const selectedMantra = mantras.find(m => m.id === settings.selectedMantraId) || mantras[0];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${settings.darkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-[#F9F8F6] text-zinc-800'}`}>
      <main className="flex-grow pb-24 overflow-y-auto">
        {view === 'home' && (
          <HomeView 
            count={currentSessionCount}
            target={settings.targetCount}
            totalMalas={stats.totalMalas}
            mantra={selectedMantra}
            onIncrement={handleIncrement}
          />
        )}
        {view === 'stats' && (
          <StatsView 
            sessions={sessions} 
            stats={stats} 
            onReset={handleResetStats}
            darkMode={settings.darkMode}
          />
        )}
        {view === 'settings' && (
          <SettingsView 
            settings={settings}
            setSettings={setSettings}
            mantras={mantras}
            setMantras={setMantras}
            onResetSession={resetSession}
          />
        )}
        {view === 'about' && <AboutView />}
      </main>

      <Navigation currentView={view} setView={(v) => {
        if (v !== 'home' && view === 'home') saveCurrentSession();
        setView(v);
      }} />
    </div>
  );
};

export default App;
