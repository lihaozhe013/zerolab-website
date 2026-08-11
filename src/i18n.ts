import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zh from '@/locales/zh.json';
import en from '@/locales/en.json';

const syncDocumentLanguage = (language: string) => {
  document.documentElement.lang = language.startsWith('zh') ? 'zh-CN' : 'en';
};

i18next.on('languageChanged', syncDocumentLanguage);

void i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    fallbackLng: 'en',
    supportedLngs: ['zh', 'en'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => syncDocumentLanguage(i18next.resolvedLanguage ?? i18next.language));

export default i18next;
