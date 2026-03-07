import React from 'react';
import { Home, BarChart2, Settings, BookOpen, Info } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'stats' | 'settings' | 'library' | 'about';
  setActiveTab: (tab: 'home' | 'stats' | 'settings' | 'library' | 'about') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 px-4 pb-8 pt-4 z-50">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <NavButton 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
          icon={<Home className="w-5 h-5" />} 
          label="काउन्टर"
        />
        <NavButton 
          active={activeTab === 'library'} 
          onClick={() => setActiveTab('library')} 
          icon={<BookOpen className="w-5 h-5" />} 
          label="महिमा"
        />
        <NavButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<BarChart2 className="w-5 h-5" />} 
          label="तथ्याङ्क"
        />
        <NavButton 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
          icon={<Settings className="w-5 h-5" />} 
          label="सेटिङ्"
        />
        <NavButton 
          active={activeTab === 'about'} 
          onClick={() => setActiveTab('about')} 
          icon={<Info className="w-5 h-5" />} 
          label="हाम्रो बारे"
        />
      </div>
    </nav>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-amber-400 scale-110' : 'text-zinc-500'}`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-widest">{label}</span>
  </button>
);

export default Navigation;
