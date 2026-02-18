
import { Mantra, UserSettings } from './types';

export const DEFAULT_MANTRAS: Mantra[] = [
  { id: '1', text: 'राधा', isCustom: false },
  { id: '2', text: 'राम', isCustom: false },
  { id: '3', text: 'महादेव', isCustom: false },
  { id: '4', text: 'ॐ नमः शिवाय', isCustom: false },
  { id: '5', text: 'ॐ नमो भगवते वासुदेवाय', isCustom: false },
  { id: '6', text: 'गोविंदाय नमः', isCustom: false },
  { id: '7', text: 'ॐ गम गणपतये नमः', isCustom: false },
  { id: '8', text: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे हरे राम हरे राम राम राम हरे हरे', isCustom: false },
];

export const DEFAULT_SETTINGS: UserSettings = {
  targetCount: 108,
  soundEnabled: true,
  vibrationEnabled: true,
  darkMode: false,
  selectedMantraId: '1',
};

export const FLUTE_SOUND_URL = 'krishna_flute.mp3';
