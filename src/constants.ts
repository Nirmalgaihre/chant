import { Mantra } from './types';

export const APP_VERSION = '1.5.0';

export const DEFAULT_MANTRAS: Mantra[] = [
  { id: '1', text: 'ॐ गं गणपतये नमः' },
  { id: '2', text: 'ॐ साम्ब सदाशिव' },
  { id: '3', text: 'ॐ श्री महालक्ष्म्यै नमः' },
  { id: '4', text: 'ॐ ऐं सरस्वत्यै नमः' },
  { id: '5', text: 'राम' },
  { id: '6', text: 'राधा' },
  { id: '7', text: 'ॐ सः स्कन्दाय नमः' },
  { id: '8', text: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥' },
  { id: '9', text: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥' },
  { id: '10', text: 'श्री राम जय राम जय जय राम ॥' },
];

export const STORAGE_KEYS = {
  SETTINGS: 'jap_settings',
  HISTORY: 'mantraHistory',
  CURRENT_SESSION: 'mantraSession',
};