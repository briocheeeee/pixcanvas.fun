import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      settings: {
        title: 'Settings',
        showGrid: 'Show Grid',
        showPixelActivity: 'Show Pixel Activity',
        enablePixelPosition: 'Enable Pixel Position',
        theme: 'Theme',
        themes: {
          'dark-round': 'Dark Round',
          dark: 'Dark',
          light: 'Light',
          'light-round': 'Light Round',
        },
        language: 'Language',
      },
      chat: {
        title: 'Chat',
        placeholder: 'Type a message...',
        loginRequired: 'Please login to chat',
      },
      pixel: {
        confirmPlace: 'Do you want to place a pixel here?',
        canPlace: 'You can place a pixel!',
        cooldown: 'Next pixel in: {{time}}s',
      },
      common: {
        yes: 'Yes',
        no: 'No',
        close: 'Close',
      },
    },
  },
  // Add other languages here
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;