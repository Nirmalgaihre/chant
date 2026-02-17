
export interface Mantra {
  id: string;
  text: string;
  isCustom: boolean;
}

export interface Session {
  id: string;
  startTime: number;
  endTime?: number;
  count: number;
  mantraId: string;
  targetCount: number;
}

export interface AppState {
  currentCount: number;
  totalMalas: number;
  selectedMantraId: string;
  mantras: Mantra[];
  sessions: Session[];
  targetCount: number;
  stats: {
    likes: number;
    dislikes: number;
  };
  settings: {
    sound: boolean;
    vibration: boolean;
    darkMode: boolean;
  };
}

export type Page = 'home' | 'stats' | 'settings' | 'about';
