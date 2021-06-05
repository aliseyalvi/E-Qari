import I18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';

const enDictionary = require('./locales/en-EN.json');
const urDictionary = require('./locales/ur-UR.json');

const Translation = {
  en: {
    translation: enDictionary,
  },
  ur: {
    translation: urDictionary,
  },
};

I18n.use(initReactI18next);

I18n.init({
  resources: Translation,
  fallbackLng: ['en', 'ur'],
  lng: 'ur',
});

I18n.on('languageChanged', lng => {
  moment.locale(lng);
});

export default I18n;
