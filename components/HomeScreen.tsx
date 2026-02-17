
import React, { useState } from 'react';

interface FloatingMantra {
  id: number;
  x: number;
  y: number;
}

interface HomeScreenProps {
  count: number;
  target: number;
  totalMalas: number;
  todayTotal: number;
  todayMalas: number;
  mantra: string;
  onIncrement: () => void;
  darkMode: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ count, target, totalMalas, todayTotal, todayMalas, mantra, onIncrement, darkMode }) => {
  const [floats, setFloats] = useState<FloatingMantra[]>([]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

    const id = Date.now();
    setFloats(prev => [...prev, { id, x: clientX, y: clientY }]);
    
    onIncrement();

    setTimeout(() => {
      setFloats(prev => prev.filter(f => f.id !== id));
    }, 1500);
  };

  const progress = (count / target) * 100;
  const radius = 125;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-between py-12 px-6 overflow-hidden select-none" 
      onPointerDown={handleTap}
    >
      {/* Background Decor */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] blur-[100px] opacity-10 rounded-full transition-colors duration-700 ${darkMode ? 'bg-orange-900' : 'bg-orange-200'}`}></div>

      {/* Top Section */}
      <div className="z-10 text-center animate-in fade-in slide-in-from-top duration-700">
        <h2 className="text-orange-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-2">Chanting</h2>
        <p className={`mantra-text text-3xl font-bold transition-all duration-500 max-w-[320px] mx-auto leading-tight ${darkMode ? 'text-slate-100' : 'text-[#000]'}`}>
          {mantra}
        </p>
      </div>

      {/* Floating Animations */}
      {floats.map(f => (
        <div 
          key={f.id} 
          className="absolute pointer-events-none z-50 mantra-text text-orange-500 text-xl font-bold animate-float whitespace-nowrap"
          style={{ left: f.x - 20, top: f.y - 20 }}
        >
          {mantra.length > 15 ? mantra.slice(0, 15) + '...' : mantra}
        </div>
      ))}

      {/* Central Counter */}
      <div className="relative flex items-center justify-center flex-1 w-full max-h-[400px]">
        <div className="relative group">
          <svg className="w-[320px] h-[320px] transform -rotate-90 filter drop-shadow-2xl">
            {/* Background Ring */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className={darkMode ? 'text-slate-900' : 'text-white'}
            />
            {/* Progress Ring */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-orange-500 transition-all duration-300 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className={`text-7xl font-black tracking-tighter transition-colors ${darkMode ? 'text-white' : 'text-[#000]'}`}>
              {count}
            </span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-300/30 to-transparent my-4"></div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">
              {target}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Summary Section */}
      <div className="z-10 w-full max-w-[360px] animate-in fade-in slide-in-from-bottom duration-700">
        <div className={`backdrop-blur-xl shadow-2xl border rounded-[2.5rem] px-8 py-7 flex flex-col items-center transition-all duration-500 ${darkMode ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white/80 border-slate-100 shadow-slate-200/50'}`}>
          <div className={`flex items-center space-x-2 text-[11px] font-black uppercase tracking-widest mb-3 whitespace-nowrap ${darkMode ? 'text-slate-400' : 'text-[#000]'}`}>
            <span>Today Count :</span>
            <span className="text-orange-500 font-black">{todayTotal}</span>
            <span className="text-slate-300 font-light mx-1">|</span>
            <span>Malas :</span>
            <span className="text-orange-500 font-black">{todayMalas}</span>
          </div>
          
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex space-x-0.5">
             {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-full transition-all duration-300 ${i < Math.floor((count/target)*10) ? 'bg-orange-500' : 'bg-transparent'}`}
                />
             ))}
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${darkMode ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-500 font-black'}`}>
              Lifetime Malas: {totalMalas}
            </div>
          </div>
        </div>
        <p className={`mt-6 text-center text-[10px] font-bold uppercase tracking-[0.3em] transition-opacity duration-300 animate-pulse ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          Tap anywhere to count
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
