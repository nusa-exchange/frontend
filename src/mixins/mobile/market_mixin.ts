import config from '@/config';
import { PublicController, TradeController } from '@/controllers';
import * as helpers from "@/library/z-helpers";
import { Component, Vue } from "vue-property-decorator";

@Component
export class MarketMixin extends Vue {
  get market() {
    if (this["market_id"]) {
      return PublicController.markets.find(market => market.id == this["market_id"]);
    }

    return TradeController.market;
  }

  get ticker() {
    const tickers = Object.values(PublicController.tickers);
    return tickers.find((ticker) => ticker.id === this.market.id);
  }

  pricePrecision(market = this.market.id) {
    return helpers.pricePrecision(market);
  }

  amountPrecision(market = this.market.id) {
    return helpers.amountPrecision(market);
  }

  totalPrecision(market = this.market.id) {
    return helpers.totalPrecision(market);
  }

  findTickers(type, data) {
    const { findTickersBase } = helpers;
    let tickers = Object.values(PublicController.tickers);

    tickers = findTickersBase(tickers, type, data);

    return tickers;
  }

  getPrice(price: string | number, market?: string) {
    return Number(price).toFixed(this.pricePrecision(market));
  }

  getAmount(amount: string | number, market?: string) {
    return Number(amount).toFixed(this.amountPrecision(market));
  }

  getTotal(amount: string | number, market?: string) {
    return Number(amount).toFixed(this.totalPrecision(market));
  }

  check_favorite(market_id: string) {
    return PublicController.helpers.check_favorite(market_id);
  }

  add_remove_favorite(market_id: string) {
    PublicController.helpers.add_remove_favorite(market_id);
  }

  percentToNumber(value: string) {
    return Number(value.replace("%", ""));
  }

  getTrend(value: string | number, bg = false) {
    if (typeof value === "string") {
      value = value.replace("%", "");
      value = Number(value);
    }

    return helpers.getTrend(value, bg);
  }

  getDate(date: Date, year = false) {
    return helpers.getDate(date, year);
  }

  getTime(time: Date) {
    return helpers.getTime(time);
  }

  trendType(type) {
    return helpers.trendType(type);
  }

  setTitle() {
    document.title = `${this.TradeController.ticker.last} - ${TradeController.market.name.toUpperCase()} - ${
      config.nameEX
    }`;
  }
}
