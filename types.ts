
export interface Mantra {
  id: string;
  text: string;
  isCustom: boolean;
}

export interface Session {
  id: string;
  startTime: number;
  endTime?: number;
  counts: number;
  mantraId: string;
}

export interface Stats {
  lifetimeTotal: number;
  totalMalas: number;
}

export interface UserSettings {
  targetCount: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  selectedMantraId: string;
}

export type ViewType = 'home' | 'stats' | 'settings' | 'about';
