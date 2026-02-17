
import { Mantra } from './types';

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

export const STORAGE_KEY = 'naam_jap_app_data_v1';

/**
 * Spiritual Inspiration Image (Premanand Ji Maharaj style)
 * This image should ideally be the Maharaj laughing art provided.
 * Since we are in a web environment, we use a beautiful high-res representative link.
 */
export const MAHARAJ_IMAGE_URL = "https://nirmalgaihre.com.np/images/name-jap-counter-logo.png";
