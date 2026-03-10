import React, { useState, useEffect } from 'react';
import { UserSettings, Mantra, HistoryEntry } from '../types';
import { DEFAULT_MANTRAS } from '../constants';
import { Plus, Trash2, Check, Settings as SettingsIcon, Bell, Volume2, Smartphone, Clock, Target, Star, Upload } from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  customMantras: Mantra[];
  onAddMantra: (text: string) => void;
  onDeleteMantra: (id: string) => void;
  history: HistoryEntry[];
}

const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  customMantras,
  onAddMantra,
  onDeleteMantra,
  history,
}) => {
  const [newMantra, setNewMantra] = useState('');
  const [totalTime, setTotalTime] = useState(0);
  const [isResetConfirming, setIsResetConfirming] = useState(false);

  useEffect(() => {
    const storedTime = localStorage.getItem('total_chant_time');
    if (storedTime) setTotalTime(parseInt(storedTime));
  }, []);

  const lifetimeChants = history.reduce((sum, h) => sum + h.chants, 0);

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} घण्टा ${minutes} मिनेट`;
    return `${minutes} मिनेट`;
  };

  const getDayChants = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];
    const entry = history.find((h: any) => h.date === dateStr);
    return entry ? entry.chants : 0;
  };

  const allMantras = [...DEFAULT_MANTRAS, ...customMantras];

  const handleAdd = () => {
    if (newMantra.trim()) {
      onAddMantra(newMantra.trim());
      setNewMantra('');
    }
  };

  const handleSoundTypeChange = (type: 'bell' | 'click' | 'bowl' | 'custom') => {
    onUpdateSettings({ ...settings, soundType: type });
    
    let soundUrl = '';
    if (type === 'custom' && settings.customSoundUrl) {
      soundUrl = settings.customSoundUrl;
    } else {
      soundUrl = type === 'bowl' ? 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' : 
                 type === 'click' ? 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3' :
                 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3';
    }
    
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCompletion: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (isCompletion) {
          onUpdateSettings({
            ...settings,
            customCompletionSoundUrl: base64
          });
        } else {
          onUpdateSettings({
            ...settings,
            soundType: 'custom',
            customSoundUrl: base64
          });
        }
        
        // Play the new sound
        const audio = new Audio(base64);
        audio.volume = 0.4;
        audio.play().catch(() => {});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetAllData = () => {
    localStorage.clear();
    window.location.href = window.location.origin; // Force a clean reload to the root
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32">
      <header className="mb-8">
        <h2 className="text-2xl font-serif text-amber-100 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-amber-400" />
          सेटिङ्हरू
        </h2>
        <p className="text-zinc-500 text-sm">तपाईको जप अनुभव अनुकूलित गर्नुहोस्</p>
      </header>

      {/* Stats Summary */}
      <section className="mb-10">
        <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold flex items-center gap-2">
          <Star className="w-3 h-3" />
          अभ्यास सारांश
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <Clock className="w-4 h-4 text-amber-500/60 mb-2" />
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">कुल समय</p>
            <p className="text-sm font-bold text-amber-100 mt-1">{formatTotalTime(totalTime)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <Target className="w-4 h-4 text-amber-500/60 mb-2" />
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">कुल जप</p>
            <p className="text-sm font-bold text-amber-100 mt-1">{lifetimeChants.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Data Points as requested */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">हालको गतिविधि (Recent Activity)</p>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">आज (Today)</span>
              <span className="text-xs font-bold text-amber-400">{getDayChants(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">हिजो (Yesterday)</span>
              <span className="text-xs font-bold text-amber-400">{getDayChants(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">३ दिन अघि (3 Days Ago)</span>
              <span className="text-xs font-bold text-amber-400">{getDayChants(3)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">७ दिन अघि (7 Days Ago)</span>
              <span className="text-xs font-bold text-amber-400">{getDayChants(7)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Goal Setting */}
      <section className="mb-10">
        <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">माला लक्ष्य</h3>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-300">प्रति माला जप संख्या</span>
            <span className="text-xl font-bold text-amber-400">{settings.target}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[27, 54, 108, 1008].map((val) => (
              <button
                key={val}
                onClick={() => onUpdateSettings({ ...settings, target: val })}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${
                  settings.target === val
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mantra Selection */}
      <section className="mb-10">
        <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">मन्त्र चयन गर्नुहोस्</h3>
        <div className="space-y-3">
          {allMantras.map((m) => (
            <div
              key={m.id}
              onClick={() => onUpdateSettings({ ...settings, currentMantraId: m.id })}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                settings.currentMantraId === m.id
                  ? 'bg-amber-500/10 border-amber-500/50'
                  : 'bg-white/5 border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex-1">
                <p className={`text-lg font-medium ${settings.currentMantraId === m.id ? 'text-amber-200' : 'text-zinc-200'}`}>
                  {m.text}
                </p>
                {m.translation && <p className="text-xs text-zinc-500 mt-1">{m.translation}</p>}
              </div>
              {settings.currentMantraId === m.id ? (
                <Check className="w-5 h-5 text-amber-400" />
              ) : (
                customMantras.some(cm => cm.id === m.id) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMantra(m.id);
                    }}
                    className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newMantra}
            onChange={(e) => setNewMantra(e.target.value)}
            placeholder="नयाँ मन्त्र थप्नुहोस्..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 text-zinc-200"
          />
          <button
            onClick={handleAdd}
            className="bg-amber-500 text-black p-3 rounded-xl hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-10">
        <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">प्राथमिकताहरू</h3>
        <div className="bg-white/5 rounded-2xl border border-white/5 divide-y divide-white/5">
          <PreferenceToggle
            icon={<Smartphone className="w-4 h-4" />}
            label="कम्पन (Vibration)"
            active={settings.vibrationEnabled}
            onToggle={() => onUpdateSettings({ ...settings, vibrationEnabled: !settings.vibrationEnabled })}
          />
          <PreferenceToggle
            icon={<Volume2 className="w-4 h-4" />}
            label="जप ध्वनि (Chant Sound)"
            active={settings.chantSoundEnabled}
            onToggle={() => onUpdateSettings({ ...settings, chantSoundEnabled: !settings.chantSoundEnabled })}
          />
          <PreferenceToggle
            icon={<Bell className="w-4 h-4" />}
            label="माला पूरा ध्वनि (Mala Completion)"
            active={settings.completionSoundEnabled}
            onToggle={() => onUpdateSettings({ ...settings, completionSoundEnabled: !settings.completionSoundEnabled })}
          />
          
          {(settings.chantSoundEnabled || settings.completionSoundEnabled) && (
            <div className="p-4 space-y-4">
              {settings.chantSoundEnabled && (
                <>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">जप ध्वनि चयन गर्नुहोस्</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['bell', 'click', 'bowl', 'custom'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleSoundTypeChange(type)}
                        className={`py-2 text-xs rounded-lg border transition-all capitalize flex items-center justify-center gap-2 ${
                          settings.soundType === type 
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' 
                            : 'bg-white/5 border-transparent text-zinc-500 hover:bg-white/10'
                        }`}
                      >
                        {type === 'bell' ? 'घण्टी' : type === 'click' ? 'क्लिक' : type === 'bowl' ? 'बाउल' : 'कस्टम'}
                        {type === 'custom' && settings.customSoundUrl && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              <div className="mt-2 space-y-3">
                {settings.chantSoundEnabled && (
                  <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-amber-500/30 hover:bg-white/5 transition-all">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-zinc-400">जप ध्वनि अपलोड गर्नुहोस्</span>
                      <span className="text-[10px] text-zinc-600">(Chant Sound)</span>
                    </div>
                    <input 
                      type="file" 
                      accept="audio/*" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, false)}
                    />
                  </label>
                )}

                {settings.completionSoundEnabled && (
                  <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-amber-500/30 hover:bg-white/5 transition-all">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-zinc-400">माला पूरा ध्वनि अपलोड गर्नुहोस्</span>
                      <span className="text-[10px] text-zinc-600">(Mala Completion)</span>
                    </div>
                    <input 
                      type="file" 
                      accept="audio/*" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, true)}
                    />
                  </label>
                )}

                {(settings.customSoundUrl || settings.customCompletionSoundUrl) && (
                  <p className="text-[10px] text-center text-zinc-600 mt-2 italic">
                    {settings.customSoundUrl && 'जप ध्वनि '}
                    {settings.customSoundUrl && settings.customCompletionSoundUrl && '& '}
                    {settings.customCompletionSoundUrl && 'माला पूरा ध्वनि '}
                    लोड गरिएको छ
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reset Data */}
      <section className="mb-10">
        <h3 className="text-xs uppercase tracking-widest text-red-400/70 mb-4 font-semibold">डाटा रिसेट गर्नुहोस् (Reset Data)</h3>
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          {!isResetConfirming ? (
            <>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                यसले तपाईको सबै जप इतिहास, अनुकूलन मन्त्रहरू र सेटिङ्हरू स्थायी रूपमा मेटाउनेछ। यो कार्य फिर्ता गर्न सकिँदैन।
              </p>
              <button
                onClick={() => setIsResetConfirming(true)}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                सबै डाटा मेट्नुहोस् (Reset All Data)
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-bold text-red-400 text-center">
                के तपाईं पक्का हुनुहुन्छ? (Are you sure?)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsResetConfirming(false)}
                  className="py-3 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-sm font-medium transition-all"
                >
                  रद्द गर्नुहोस् (Cancel)
                </button>
                <button
                  onClick={handleResetAllData}
                  className="py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all"
                >
                  हो, मेट्नुहोस् (Yes, Delete)
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const PreferenceToggle = ({ icon, label, active, onToggle }: { icon: React.ReactNode, label: string, active: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between p-4">
    <div className="flex items-center gap-3">
      <div className="text-amber-400/60">{icon}</div>
      <span className="text-sm text-zinc-300">{label}</span>
    </div>
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-amber-500' : 'bg-zinc-800'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

export default SettingsView;
