import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { store } from './redux/store';
import Root from './routers/Root';
import 'react-toastify/dist/ReactToastify.css';
import en from './translation/en';
import vi from './translation/vi';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const root = ReactDOM.createRoot(document.getElementById('root'));

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: en
    },
    vi: {
      translation: vi
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

root.render(
  <Provider store={store}>
    <Root />
  </Provider>
);
