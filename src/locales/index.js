import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import * as zh_CN from './zh-CN';
import * as en_US from './en-US';

const resources = {zh_CN, en_US}; 
const localLNG = window.localStorage.getItem('lng') || 'zh_CN';
i18n.use(initReactI18next).init({
  resources,
  lng: localLNG,
  keySeparator: false, // we do not use keys in form messages.welcome
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
