import Vue from "vue";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export interface Store {
  theme: "night" | "light";
  page_ready: boolean;
  favorites: string[];
  currencies?: ZTypes.Currency[];
  markets?: ZTypes.Market[];
  tickers?: ZTypes.Tickers;
  trading_fees?: ZTypes.TradingFee[];
  global_price?: ZTypes.GlobalPrice;
  banners?: ZTypes.Banner[];
  broadcasts?: ZTypes.BroadCast[];
}

const store: Store = reactive<Store>({
  theme: "night",
  page_ready: false,
  favorites: JSON.parse(localStorage.getItem("favorites") || null) || [],
  currencies: null,
  markets: null,
  tickers: null,
  trading_fees: null,
  global_price: null,
  banners: null,
  broadcasts: null
});

export default store;
