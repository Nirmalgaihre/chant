import React, { useState } from 'react';
import { UserSettings, Mantra } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  mantras: Mantra[];
  setMantras: React.Dispatch<React.SetStateAction<Mantra[]>>;
  onResetSession: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  mantras,
  setMantras,
  onResetSession,
}) => {
  const [newMantra, setNewMantra] = useState('');

  const addMantra = () => {
    if (!newMantra.trim()) return;
    const mantra: Mantra = {
      id: Date.now().toString(),
      text: newMantra.trim(),
      isCustom: true,
    };
    setMantras((prev) => [...prev, mantra]);
    setNewMantra('');
  };

  const deleteMantra = (id: string) => {
    if (settings.selectedMantraId === id) {
      // Fallback to first remaining mantra or default
      const remaining = mantras.filter((m) => m.id !== id);
      setSettings((s) => ({
        ...s,
        selectedMantraId: remaining[0]?.id || '1',
      }));
    }
    setMantras((prev) => prev.filter((m) => m.id !== id));
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const isDark = settings.darkMode;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 pt-10 px-5 sm:px-6 md:px-8">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Settings
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Customize your Jap experience
          </p>
        </header>

        {/* ── Mantra Selection ── */}
        <section className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-500">
            Your Mantras
          </h2>

          <div className="space-y-3">
            {mantras.map((mantra) => {
              const isSelected = settings.selectedMantraId === mantra.id;
              return (
                <button
                  key={mantra.id}
                  type="button"
                  onClick={() => updateSetting('selectedMantraId', mantra.id)}
                  className={`
                    group w-full flex items-center justify-between gap-4
                    p-4 rounded-2xl transition-all duration-300
                    border ${isSelected
                      ? 'border-orange-500/70 bg-orange-50/70 dark:bg-orange-950/30 dark:border-orange-600/50'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }
                    active:scale-[0.98]
                  `}
                >
                  <span
                    className={`
                      Hindi-font text-lg font-medium truncate flex-1 text-left
                      ${isSelected ? 'text-orange-700 dark:text-orange-300' : 'text-zinc-800 dark:text-zinc-200'}
                    `}
                  >
                    {mantra.text}
                  </span>

                  <div className="flex items-center gap-3 shrink-0">
                    {mantra.isCustom && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMantra(mantra.id);
                        }}
                        className="p-2 -mr-2 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Delete mantra"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}

                    {isSelected && (
                      <svg
                        className="w-6 h-6 text-orange-600 dark:text-orange-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add new mantra */}
          <div className="flex gap-3 mt-6">
            <input
              type="text"
              value={newMantra}
              onChange={(e) => setNewMantra(e.target.value)}
              placeholder="Enter new mantra..."
              className={`
                flex-1 px-5 py-4 rounded-2xl border text-base
                bg-white dark:bg-zinc-900
                border-zinc-200 dark:border-zinc-800
                focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50
                dark:focus:border-orange-500 dark:focus:ring-orange-900/40
                outline-none transition-all placeholder-zinc-400 dark:placeholder-zinc-600
              `}
            />
            <button
              onClick={addMantra}
              disabled={!newMantra.trim()}
              className={`
                px-6 py-4 rounded-2xl font-semibold text-white
                bg-orange-600 hover:bg-orange-700 active:bg-orange-800
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-sm hover:shadow
              `}
            >
              Add
            </button>
          </div>
        </section>

        {/* ── Preferences ── */}
        <section className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-500">
            Preferences
          </h2>

          <div
            className={`
              rounded-3xl overflow-hidden border
              ${isDark
                ? 'bg-zinc-900/70 border-zinc-800/80'
                : 'bg-white border-zinc-200/80 shadow-sm'}
            `}
          >
            <SettingRow
              label="Target Count"
              value={
                <input
                  type="number"
                  value={settings.targetCount}
                  onChange={(e) => updateSetting('targetCount', Number(e.target.value))}
                  className={`
                    w-24 text-right text-lg font-semibold
                    bg-transparent outline-none text-orange-600 dark:text-orange-400
                  `}
                />
              }
            />

            <SettingRow
              label="Sound Effects"
              value={
                <Toggle
                  enabled={settings.soundEnabled}
                  onChange={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                />
              }
            />

            <SettingRow
              label="Vibration Feedback"
              value={
                <Toggle
                  enabled={settings.vibrationEnabled}
                  onChange={() => updateSetting('vibrationEnabled', !settings.vibrationEnabled)}
                />
              }
            />

            <SettingRow
              label="Dark Mode"
              value={
                <Toggle
                  enabled={settings.darkMode}
                  onChange={() => updateSetting('darkMode', !settings.darkMode)}
                />
              }
              border={false}
            />
          </div>
        </section>

        {/* Reset Session */}
        <section>
          <button
            onClick={() => {
              if (confirm('Reset current session? This cannot be undone.')) {
                onResetSession();
              }
            }}
            className={`
              w-full py-4 px-6 rounded-2xl font-semibold text-base
              bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300
              hover:bg-zinc-200 dark:hover:bg-zinc-700
              active:bg-zinc-300 dark:active:bg-zinc-600
              transition-all duration-200
            `}
          >
            Reset Current Session
          </button>
        </section>
      </div>
    </div>
  );
};

/* ── Reusable Setting Row ── */
function SettingRow({
  label,
  value,
  border = true,
}: {
  label: string;
  value: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div
      className={`
        flex items-center justify-between px-6 py-4
        ${border ? 'border-b border-zinc-200/70 dark:border-zinc-800/70' : ''}
      `}
    >
      <span className="text-base font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </span>
      {value}
    </div>
  );
}

/* ── Custom Toggle Switch ── */
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`
        relative inline-flex h-7 w-14 items-center rounded-full
        transition-colors duration-300 ease-in-out
        ${enabled ? 'bg-orange-600' : 'bg-zinc-300 dark:bg-zinc-600'}
      `}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`
          inline-block h-6 w-6 transform rounded-full bg-white shadow
          transition duration-300 ease-in-out
          ${enabled ? 'translate-x-7' : 'translate-x-0.5'}
        `}
      />
    </button>
  );
}

export default SettingsView;