import config from '@/config';
import { PublicController } from '..';
import { Store, ExchangeLayout } from './store';

export default class GettersSetters {
  store!: Store;

  get market(): ZTypes.Market {
    return this.store.market;
  }

  set market(market: ZTypes.Market) {
    this.store.market = market;
    localStorage.setItem("market", market.id);
  }

  get ticker() {
    return PublicController.tickers[this.market.id];
  }

  get trades() {
    return this.store.trades;
  }

  set trades(trades : ZTypes.PublicTrade[]) {
    this.store.trades = trades;
    this.store.trades = this.store.trades.sort((a, b) => b.id - a.id);

    const latest_trade = trades[0];

    if (!latest_trade) return;

    document.title = `${latest_trade.price} - ${(
      this.market.name
    ).toUpperCase()} - ${config.nameEX}`;
  }

  get exchange_layout() {
    return this.store.exchange_layout;
  }

  set exchange_layout(layout: ExchangeLayout) {
    if (layout != "basic" && layout != "pro") {
      layout = "basic";
    }

    this.store.exchange_layout = layout;
    localStorage.setItem("exchange_layout", layout);
  }
}
