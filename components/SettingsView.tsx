// src/components/SettingsView.tsx
import React, { useState, useEffect } from 'react';
import { UserSettings, Mantra } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  mantras: Mantra[];
  setMantras: React.Dispatch<React.SetStateAction<Mantra[]>>;
  onResetAllData: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  mantras,
  setMantras,
  onResetAllData,
}) => {
  const [newMantra, setNewMantra] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showResetComplete, setShowResetComplete] = useState(false);

  useEffect(() => {
    if (showResetComplete) {
      const timer = setTimeout(() => {
        setShowResetComplete(false);
        window.location.replace(window.location.href);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [showResetComplete]);

  const addMantra = () => {
    if (!newMantra.trim()) return;
    const newItem: Mantra = {
      id: Date.now().toString(),
      text: newMantra.trim(),
      isCustom: true,
    };
    setMantras(prev => [...prev, newItem]);
    setNewMantra('');
  };

  const deleteMantra = (id: string) => {
    if (settings.selectedMantraId === id) {
      const remaining = mantras.filter(m => m.id !== id);
      setSettings(s => ({
        ...s,
        selectedMantraId: remaining[0]?.id || '',
      }));
    }
    setMantras(prev => prev.filter(m => m.id !== id));
  };

  const handleFullReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!showConfirmReset) {
      setShowConfirmReset(true);
      return;
    }

    // Clear data
    localStorage.removeItem('mantraSession');
    localStorage.removeItem('mantraHistory');

    onResetAllData();

    // Show completion message → then reload
    setShowResetComplete(true);
    setShowConfirmReset(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-24 pt-10 px-6 text-zinc-100 relative">
      <div className="max-w-2xl mx-auto space-y-10">

        <h1 className="text-4xl font-bold">Settings</h1>

        <section className="space-y-6">
          <h2 className="text-orange-500 uppercase text-sm font-semibold tracking-wider">
            Your Mantras
          </h2>

          <div className="space-y-3">
            {mantras.map(m => {
              const isSelected = settings.selectedMantraId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSettings(s => ({ ...s, selectedMantraId: m.id }))}
                  className={`p-4 rounded-2xl border flex justify-between items-center cursor-pointer transition-all ${
                    isSelected ? 'border-orange-600 bg-orange-950/30' : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <span className={`Hindi-font text-lg ${isSelected ? 'text-orange-300' : 'text-zinc-200'}`}>
                    {m.text}
                  </span>
                  {m.isCustom && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        deleteMantra(m.id);
                      }}
                      className="text-red-400 hover:text-red-300 text-xl px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <input
              value={newMantra}
              onChange={e => setNewMantra(e.target.value)}
              placeholder="Add new mantra..."
              className="flex-1 px-5 py-4 rounded-2xl bg-zinc-900 border border-zinc-700 focus:border-orange-500 outline-none text-zinc-100"
            />
            <button
              onClick={addMantra}
              disabled={!newMantra.trim()}
              className="px-6 py-4 bg-orange-600 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </section>

        <section className="space-y-6 pt-12">
          <div className="text-center text-zinc-400 text-sm mb-5">
            This will permanently delete all progress (today + lifetime + history).
          </div>

          {showResetComplete ? (
            <div className="text-center py-20 animate-pulse">
              <div className="text-4xl font-bold text-green-400 mb-6">
                ✓ Reset Complete
              </div>
              <p className="text-zinc-300 text-xl">
                All data has been cleared.<br />
                Reloading app...
              </p>
            </div>
          ) : showConfirmReset ? (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center text-red-300 font-medium text-xl tracking-wide">
                Are you sure? This cannot be undone.
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-5 px-6 bg-zinc-800 rounded-2xl text-zinc-200 font-medium hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFullReset}
                  className="flex-1 py-5 px-6 bg-red-700 rounded-2xl text-white font-bold hover:bg-red-600 transition shadow-lg"
                >
                  Yes, Delete Everything
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleFullReset}
              className="w-full py-6 px-8 bg-gradient-to-r from-red-900 via-red-800 to-red-700 rounded-2xl text-xl font-bold text-white shadow-xl hover:brightness-110 active:brightness-90 transition-all transform active:scale-[0.98]"
            >
              Reset All Data
            </button>
          )}
        </section>

      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SettingsView;