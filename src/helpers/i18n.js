import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useTranslation } from 'react-i18next';
import { getCookie } from "./sessionCookie";
import translationGB from "../locales/GB/translation.json";
import translationES from "../locales/ES/translation.json";
import translationFR from "../locales/FR/translation.json";
import translationPT from "../locales/PT/translation.json";

// const { t, i18n } = useTranslation();

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: "GB",
    lng: getCookie('language'),
    interpolation: {
      escapeValue: false,
    },
    resources: {
      GB: {
        translation: translationGB
      },
      ES: {
        translation: translationES
      },
      FR:{
        translation: translationFR
      },
      PT: {
        translation: translationPT
      },
    },
  })


export default i18n;