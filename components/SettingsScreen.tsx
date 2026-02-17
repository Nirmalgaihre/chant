
import React, { useState } from 'react';
import { AppState, Mantra } from '../types';
import { Plus, Trash2, X, Check, Bell, Volume2, Moon, RotateCcw, Target } from 'lucide-react';

interface SettingsScreenProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onEndSession: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ state, setState, onEndSession }) => {
  const [newMantra, setNewMantra] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const { darkMode } = state.settings;

  const handleAddMantra = () => {
    if (!newMantra.trim()) return;
    const mantra: Mantra = {
      id: Date.now().toString(),
      text: newMantra.trim(),
      isCustom: true
    };
    setState(prev => ({
      ...prev,
      mantras: [...prev.mantras, mantra],
      selectedMantraId: mantra.id
    }));
    setNewMantra('');
    setShowAdd(false);
  };

  const handleDeleteMantra = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setState(prev => {
      const filtered = prev.mantras.filter(m => m.id !== id);
      return {
        ...prev,
        mantras: filtered,
        selectedMantraId: prev.selectedMantraId === id ? (filtered[0]?.id || '1') : prev.selectedMantraId
      };
    });
  };

  const updateSetting = (key: keyof AppState['settings'], val: boolean) => {
    setState(p => ({ ...p, settings: { ...p.settings, [key]: val } }));
  };

  return (
    <div className="p-6 pt-12 space-y-8 animate-in slide-in-from-right duration-500 pb-12">
      <header>
        <h1 className={`text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>Settings</h1>
        <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mt-1">Configure your experience</p>
      </header>

      {/* Mantra Selection */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Active Mantra</h3>
          <button 
            onClick={() => setShowAdd(true)}
            className="flex items-center space-x-1 text-orange-500 text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={14} />
            <span>New</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {state.mantras.map(m => (
            <div 
              key={m.id}
              onClick={() => setState(prev => ({ ...prev, selectedMantraId: m.id }))}
              className={`p-5 rounded-[1.5rem] border transition-all duration-300 cursor-pointer flex items-center justify-between group ${state.selectedMantraId === m.id ? (darkMode ? 'bg-orange-500/10 border-orange-500/50' : 'bg-orange-50 border-orange-200 shadow-sm') : (darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100')}`}
            >
              <span className={`mantra-text flex-1 text-base ${state.selectedMantraId === m.id ? 'text-orange-500 font-bold' : (darkMode ? 'text-slate-400' : 'text-slate-600')}`}>
                {m.text}
              </span>
              <div className="flex items-center space-x-3">
                {state.selectedMantraId === m.id && <Check size={18} className="text-orange-500" />}
                {m.isCustom && (
                  <button onClick={(e) => handleDeleteMantra(m.id, e)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice Configuration */}
      <section className="space-y-4">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Target Config</h3>
        <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 text-orange-400' : 'bg-orange-50 text-orange-500'}`}><Target size={20} /></div>
              <span className={`font-bold text-sm ${darkMode ? 'text-slate-200' : 'text-black'}`}>Target per Mala</span>
            </div>
            <input 
              type="number" 
              value={state.targetCount}
              onChange={(e) => setState(p => ({ ...p, targetCount: Math.max(1, parseInt(e.target.value) || 108) }))}
              className={`w-20 text-center font-black py-2 rounded-xl border-none focus:ring-1 focus:ring-orange-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-black'}`}
            />
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-4">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>App Preferences</h3>
        <div className={`rounded-[2rem] border overflow-hidden divide-y ${darkMode ? 'bg-slate-900 border-slate-800 divide-slate-800' : 'bg-white border-slate-100 divide-slate-50'}`}>
          <ToggleItem 
            icon={<Moon size={20} />} 
            label="Dark Mode" 
            enabled={state.settings.darkMode} 
            onClick={() => updateSetting('darkMode', !state.settings.darkMode)} 
            darkMode={darkMode}
          />
          <ToggleItem 
            icon={<Volume2 size={20} />} 
            label="Sound Effects" 
            enabled={state.settings.sound} 
            onClick={() => updateSetting('sound', !state.settings.sound)} 
            darkMode={darkMode}
          />
          <ToggleItem 
            icon={<Bell size={20} />} 
            label="Vibrations" 
            enabled={state.settings.vibration} 
            onClick={() => updateSetting('vibration', !state.settings.vibration)} 
            darkMode={darkMode}
          />
          <button 
            onClick={() => {
              if (confirm("End current session and reset counter?")) {
                onEndSession();
                setState(p => ({ ...p, currentCount: 0 }));
              }
            }}
            className={`w-full flex items-center justify-between p-6 transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 text-red-400' : 'bg-red-50 text-red-500'}`}><RotateCcw size={20} /></div>
              <span className={`font-bold text-sm ${darkMode ? 'text-red-400' : 'text-red-500'}`}>Reset Current Session</span>
            </div>
          </button>
        </div>
      </section>

      {/* Add Mantra Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className={`w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-black'}`}>New Mantra</h2>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <textarea 
              autoFocus
              className={`w-full h-32 rounded-[1.5rem] p-6 text-lg font-medium border-none focus:ring-2 focus:ring-orange-500/50 mb-8 mantra-text ${darkMode ? 'bg-slate-950 text-white placeholder-slate-600' : 'bg-slate-50 text-black placeholder-slate-400'}`}
              placeholder="e.g. ॐ नमः शिवाय"
              value={newMantra}
              onChange={(e) => setNewMantra(e.target.value)}
            />
            <button 
              onClick={handleAddMantra}
              disabled={!newMantra.trim()}
              className="w-full py-5 bg-orange-500 text-white font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-orange-500/20 disabled:opacity-30 transition-all active:scale-95"
            >
              Add to Collection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface ToggleItemProps {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  onClick: () => void;
  darkMode: boolean;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ icon, label, enabled, onClick, darkMode }) => (
  <div className="flex items-center justify-between p-6">
    <div className={`flex items-center space-x-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>{icon}</div>
      <span className="font-bold text-sm uppercase tracking-wide">{label}</span>
    </div>
    <button 
      onClick={onClick}
      className={`w-14 h-7 rounded-full relative transition-all duration-500 ${enabled ? 'bg-orange-500 shadow-inner' : (darkMode ? 'bg-slate-800' : 'bg-slate-200')}`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 transform ${enabled ? 'left-8' : 'left-1'}`}></div>
    </button>
  </div>
);

export default SettingsScreen;
