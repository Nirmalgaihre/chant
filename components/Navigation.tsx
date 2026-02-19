// Navigation.tsx
import React from 'react';
import { ViewType } from '../types'; // adjust path if needed

interface NavigationProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const tabs: Array<{ id: ViewType; label: string; icon: React.ReactNode }> = [
    {
      id: 'home',
      label: 'Jap',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Setup',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'about',
      label: 'About',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="
        fixed inset-x-0 bottom-0 z-50
        pb-[env(safe-area-inset-bottom)]
        pointer-events-none
      "
    >
      <div
        className="
          mx-auto max-w-md px-5 sm:px-6
          bg-zinc-900/60 backdrop-blur-xl
          border border-zinc-700/50
          shadow-2xl shadow-black/25
          rounded-2xl
          pointer-events-auto
          mt-4 mb-3
        "
      >
        <div className="flex items-center justify-around py-3">
          {tabs.map((tab) => {
            const isActive = currentView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`
                  group flex flex-col items-center justify-center
                  min-w-[4.25rem] py-2 px-3 rounded-xl
                  transition-all duration-300 ease-out
                  active:scale-95 touch-manipulation
                  ${isActive
                    ? 'text-orange-400'
                    : 'text-zinc-400 hover:text-zinc-200 active:text-zinc-300'
                  }
                `}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div
                  className={`
                    p-2.5 rounded-full transition-all duration-300
                    ${isActive
                      ? 'bg-orange-950/40 shadow-inner shadow-orange-900/30'
                      : 'group-hover:bg-zinc-800/50 group-active:bg-zinc-800/70'
                    }
                  `}
                >
                  {React.cloneElement(tab.icon as React.ReactElement, {
                    className: `
                      w-6 h-6 stroke-[2] transition-all duration-300
                      ${isActive ? 'scale-110' : 'group-hover:scale-105 group-active:scale-95'}
                    `,
                  })}
                </div>

                <span
                  className={`
                    mt-1.5 text-[10px] font-medium uppercase tracking-wider
                    transition-all duration-300
                    ${isActive ? 'text-orange-400' : 'text-zinc-500 group-hover:text-zinc-300'}
                  `}
                >
                  {tab.label}
                </span>

                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;