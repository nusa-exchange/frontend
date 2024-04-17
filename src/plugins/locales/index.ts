import config from "@/config";
import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const { messages } = config;

export const i18n = new VueI18n({
  locale: localStorage.getItem("LANGUAGE_HASH") || "en", // set locale
  fallbackLocale: "en", // set fallback locale
  messages
});
