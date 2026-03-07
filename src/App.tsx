/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Mantra, UserSettings, HistoryEntry } from './types';
import { DEFAULT_MANTRAS, STORAGE_KEYS } from './constants';
import HomeView from './components/HomeView';
import SettingsView from './components/SettingsView';
import StatsView from './components/StatsView';
import LibraryView from './components/LibraryView';
import AboutView from './components/AboutView';
import Navigation from './components/Navigation';
import WhatsNewModal from './components/WhatsNewModal';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'settings' | 'library' | 'about'>('home');
  const [settings, setSettings] = useState<UserSettings>({
    target: 108,
    currentMantraId: '1',
    isVoiceEnabled: false,
    vibrationEnabled: true,
    chantSoundEnabled: true,
    completionSoundEnabled: true,
    soundType: 'bell',
  });
  const [customMantras, setCustomMantras] = useState<Mantra[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load initial data
  useEffect(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (storedSettings) setSettings(JSON.parse(storedSettings));

    const storedCustom = localStorage.getItem('custom_mantras');
    if (storedCustom) setCustomMantras(JSON.parse(storedCustom));

    const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    let initialHistory: HistoryEntry[] = storedHistory ? JSON.parse(storedHistory) : [];
    
    // Seed "real data" if history is empty or as requested
    if (initialHistory.length === 0) {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      const yesterdayDate = new Date();
      yesterdayDate.setDate(now.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().split('T')[0];
      
      const threeDaysAgoDate = new Date();
      threeDaysAgoDate.setDate(now.getDate() - 3);
      const threeDaysAgo = threeDaysAgoDate.toISOString().split('T')[0];
      
      const sevenDaysAgoDate = new Date();
      sevenDaysAgoDate.setDate(now.getDate() - 7);
      const sevenDaysAgo = sevenDaysAgoDate.toISOString().split('T')[0];

      initialHistory = [
        { date: sevenDaysAgo, chants: 108 },
        { date: threeDaysAgo, chants: 54 },
        { date: yesterday, chants: 216 },
        { date: today, chants: 108 },
      ];
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(initialHistory));
      
      // Also seed current session for today
      const currentSession = {
        date: today,
        todayChants: 108,
        totalChants: 486 // 108+54+216+108
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(currentSession));
    }
    
    setHistory(initialHistory);
  }, []);

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const handleAddMantra = (text: string) => {
    const newMantra: Mantra = {
      id: Date.now().toString(),
      text,
    };
    const updated = [...customMantras, newMantra];
    setCustomMantras(updated);
    localStorage.setItem('custom_mantras', JSON.stringify(updated));
  };

  const handleDeleteMantra = (id: string) => {
    const updated = customMantras.filter(m => m.id !== id);
    setCustomMantras(updated);
    localStorage.setItem('custom_mantras', JSON.stringify(updated));
    if (settings.currentMantraId === id) {
      setSettings({ ...settings, currentMantraId: '1' });
    }
  };

  const currentMantra = [...DEFAULT_MANTRAS, ...customMantras].find(m => m.id === settings.currentMantraId) || DEFAULT_MANTRAS[0];

  const handleVoiceIncrement = () => {
    // This will be handled by the HomeView's logic if we were using a global store,
    // but for this MVP, we'll trigger a count update in local storage which HomeView will pick up.
    // In a real app, we'd use a shared state or context.
    const today = new Date().toISOString().split('T')[0];
    const storedCurrent = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    let current = storedCurrent ? JSON.parse(storedCurrent) : { date: today, todayChants: 0, totalChants: 0 };
    
    if (current.date !== today) {
      current = { date: today, todayChants: 1, totalChants: current.totalChants + 1 };
    } else {
      current.todayChants += 1;
      current.totalChants += 1;
    }
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(current));
    
    // Update history
    const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    let history: HistoryEntry[] = storedHistory ? JSON.parse(storedHistory) : [];
    const dayIndex = history.findIndex(h => h.date === today);
    if (dayIndex >= 0) {
      history[dayIndex].chants = current.todayChants;
    } else {
      history.push({ date: today, chants: current.todayChants });
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    setHistory(history);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-zinc-100 font-sans selection:bg-amber-500/30">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {activeTab === 'home' && (
              <HomeView 
                settings={settings}
                mantra={currentMantra} 
                onCountUpdate={(total) => {
                  // Sync history state when count updates in HomeView
                  const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
                  if (storedHistory) setHistory(JSON.parse(storedHistory));
                }}
              />
            )}
            {activeTab === 'library' && (
              <LibraryView 
                currentMantraId={settings.currentMantraId}
                customMantras={customMantras}
                onSelectMantra={(id) => setSettings({ ...settings, currentMantraId: id })}
              />
            )}
            {activeTab === 'stats' && (
              <StatsView history={history} settings={settings} />
            )}
            {activeTab === 'settings' && (
              <SettingsView 
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                customMantras={customMantras}
                onAddMantra={handleAddMantra}
                onDeleteMantra={handleDeleteMantra}
                history={history}
              />
            )}
            {activeTab === 'about' && (
              <AboutView />
            )}
          </motion.main>
        </AnimatePresence>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <WhatsNewModal />
      </div>
    </div>
  );
}
