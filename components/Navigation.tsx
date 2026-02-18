// Navigation.tsx
import React from 'react';
import { ViewType } from '../types'; // Adjust path if needed

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
      "
    >
      {/* ────────────────────────────────────────────────
          Variant 1: Rounded rectangle with frosted glass (most common professional look)
      ──────────────────────────────────────────────── */}
      <div
        className="
          mx-auto max-w-md px-4 sm:px-6
          bg-white/75 dark:bg-neutral-900/75
          backdrop-blur-2xl
          border border-neutral-200/60 dark:border-neutral-800/50
          shadow-xl shadow-black/8 dark:shadow-black/35
          rounded-2xl
        "
      >
        <div className="flex items-center justify-around py-2.5">
          {tabs.map((tab) => {
            const isActive = currentView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`
                  group relative flex flex-col items-center
                  min-w-[4.5rem] py-2 px-3 rounded-xl
                  transition-all duration-300 ease-out
                  touch-manipulation
                  ${isActive
                    ? 'text-orange-600 scale-105'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
                aria-label={tab.label}
              >
                <div
                  className={`
                    p-3 rounded-full transition-all duration-300
                    ${isActive
                      ? 'bg-orange-100 dark:bg-orange-950/50 scale-110 shadow-sm'
                      : 'group-hover:bg-neutral-100/70 dark:group-hover:bg-neutral-800/40'
                    }
                  `}
                >
                  {React.cloneElement(tab.icon as React.ReactElement, {
                    className: `w-6 h-6 stroke-[1.9] transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'
                    }`,
                  })}
                </div>

                <span
                  className={`
                    mt-1.5 text-[10px] font-semibold uppercase tracking-wider
                    transition-all duration-300
                    ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}
                  `}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-orange-500/90" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────
          Variant 2: Floating pill / capsule style (very trendy 2025–2026 mobile UI)
          Uncomment the block below and comment out the previous one if you prefer this look
      ──────────────────────────────────────────────── */}

      {/* 
      <div
        className="
          mx-auto max-w-sm px-6
          bg-white/80 dark:bg-neutral-900/80
          backdrop-blur-2xl
          border border-neutral-200/40 dark:border-neutral-700/40
          shadow-2xl shadow-black/12 dark:shadow-black/40
          rounded-full
        "
      >
        <div className="flex items-center justify-center gap-6 sm:gap-10 py-3.5">
          {tabs.map((tab) => {
            const isActive = currentView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`
                  group relative p-3 rounded-full transition-all duration-300
                  ${isActive
                    ? 'bg-orange-100 dark:bg-orange-950/60 scale-110 shadow-md'
                    : 'hover:bg-neutral-100/70 dark:hover:bg-neutral-800/40'
                  }
                `}
                aria-label={tab.label}
              >
                {React.cloneElement(tab.icon as React.ReactElement, {
                  className: `w-7 h-7 stroke-[1.8] transition-transform duration-300 ${
                    isActive ? 'scale-110 text-orange-600' : 'text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200'
                  }`,
                })}

                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      */}
    </nav>
  );
};

export default Navigation;