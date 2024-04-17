import colors from "@/colors";
import ZSmartModel from "@/library/z-eventbus";
import { Store } from './store';

export default class GettersSetters {
  store!: Store;

  get theme() {
    return this.store.theme;
  }

  set theme(theme) {
    this.store.theme = theme;
  }

  get page_ready() {
    return this.store.page_ready;
  }

  set page_ready(page_ready: boolean) {
    const meta = document.querySelector("meta[name='theme-color']");

    meta.setAttribute("content", colors["bg-card-color"]);
    this.store.page_ready = page_ready;
  }

  get favorites() {
    return this.store.favorites;
  }

  set favorites(favorites: string[]) {
    localStorage.setItem("favorites", JSON.stringify(favorites));

    this.store.favorites = favorites;
  }

  get currencies() {
    return this.store.currencies;
  }

  set currencies(currencies: ZTypes.Currency[]) {
    this.store.currencies = currencies;
  }

  get markets() {
    return this.store.markets;
  }

  set markets(markets: ZTypes.Market[]) {
    this.store.markets = markets;
  }

  get tickers() {
    const tickers = this.store.tickers
    for (const id in tickers) {
      const ticker = tickers[id];
      const market = this.markets.find(market => market.id === id);

      ticker.id = market.id;
      ticker.name = market.name;
      ticker.base_unit = market.base_unit;
      ticker.quote_unit = market.quote_unit;

      tickers[id] = ticker;
    }

    return tickers;
  }

  set tickers(tickers: ZTypes.Tickers) {
    this.store.tickers = tickers;
  }

  get trading_fees() {
    return this.store.trading_fees;
  }

  set trading_fees(trading_fees: ZTypes.TradingFee[]) {
    this.store.trading_fees = trading_fees;
  }

  get global_price() {
    return this.store.global_price;
  }

  set global_price(global_price: ZTypes.GlobalPrice) {
    this.store.global_price = global_price;
  }

  get banners() {
    return this.store.banners;
  }

  set banners(banners) {
    this.store.banners = banners;
  }

  get broadcasts() {
    return this.store.broadcasts;
  }

  set broadcasts(broadcasts) {
    this.store.broadcasts = broadcasts;
  }
}
