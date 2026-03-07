export interface Mantra {
  id: string;
  text: string;
  translation?: string;
}

export interface UserSettings {
  target: number;
  currentMantraId: string;
  isVoiceEnabled: boolean;
  vibrationEnabled: boolean;
  chantSoundEnabled: boolean;
  completionSoundEnabled: boolean;
  soundType: 'bell' | 'click' | 'bowl' | 'custom';
  customSoundUrl?: string;
  customCompletionSoundUrl?: string;
}

export interface HistoryEntry {
  date: string;
  chants: number;
  startTime?: number;
}

export interface SessionData {
  date: string;
  todayChants: number;
  totalChants: number;
}
