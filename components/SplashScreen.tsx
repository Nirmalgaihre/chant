
import React from 'react';
import { MAHARAJ_IMAGE_URL } from '../constants';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[1000] animate-in fade-in duration-700">
      {/* Background Divine Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-orange-50 to-white opacity-50"></div>
      
      <div className="relative">
        {/* Outer Halo */}
        <div className="absolute inset-0 bg-orange-400/20 blur-[80px] rounded-full scale-150 animate-pulse"></div>
        
        {/* Maharaj Logo */}
        <div className="relative w-40 h-40 bg-white rounded-full p-1 shadow-2xl flex items-center justify-center transform animate-in zoom-in duration-1000 overflow-hidden ring-4 ring-orange-100">
          <img 
            src={MAHARAJ_IMAGE_URL} 
            alt="Pujya Shri Premanand Ji Maharaj" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      
      <div className="mt-12 text-center space-y-3 animate-in slide-in-from-bottom duration-1000 delay-300 relative z-10">
        <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Naam Jap Counter</h1>
        <div className="flex items-center justify-center space-x-3">
          <div className="h-px w-8 bg-orange-300"></div>
          <p className="text-orange-500 font-bold text-sm uppercase tracking-[0.4em]">Radha Radha</p>
          <div className="h-px w-8 bg-orange-300"></div>
        </div>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center space-y-4 animate-in fade-in duration-1000 delay-500">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Humble Dedication</p>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
        </div>
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] pt-4 border-t border-slate-100">Crafted by Nirmal Gaihre</p>
      </div>
    </div>
  );
};

export default SplashScreen;
