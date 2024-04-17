import { PublicController } from '@/controllers';
import { getTicker } from "../getTicker";
import { getTickerPriceUSD } from "../getTickerPriceUSD";

export const CURRENCY = () => {
  const currencies: ZTypes.Currency[] = PublicController.currencies;

  return currencies.map(currency => currency.id); //["ETH", "BTC", "ETC", "BZX"]
};

export class Currency {
  currency: string;
  DATA: ZTypes.Currency[];
  constructor(currency: string) {
    this.DATA = PublicController.currencies;
    this.currency = currency;
  }

  get() {
    const { DATA } = this;
    for (const row of DATA) {
      if (row.id === this.currency) return row;
    }
  }

  getAllName() {
    const { DATA } = this;

    return DATA.map(currency => currency.id.toUpperCase()); //["ETH", "BTC", "ETC", "BZX"]
  }

  getPrice(toCurrency: string) {
    const Currency_Convert = ["BTC", "USDT", "USD"];

    if (!Currency_Convert.includes(toCurrency)) return;
    if (toCurrency === "BTC") {
      return this.getPriceByBTC();
    } else if (toCurrency === "USDT") {
      return this.getPriceByUSDT();
    } else if (toCurrency === "USD") {
      return this.getPriceByUSD();
    }
  }

  getPriceByUSDT() {
    //step 1
    if (this.currency === "usdt") {
      return 1;
    } else if (this.currency === "usd") {
      const price = PublicController.global_price.USD;
      return Number(price.USDT);
    }

    //step 2
    const priceUSD = this.getPriceByUSD();
    const GlobalPrice = PublicController.global_price;

    return (Number(priceUSD) * GlobalPrice.USD.USDT).toFixedNumber(2);
  }

  getPriceByBTC() {
    //step 1
    if (this.currency === "btc") {
      return 1;
    }

    //step 2
    const market_find_btc = getTicker(this.currency + "btc");
    if (market_find_btc) return Number(market_find_btc.last).toFixedNumber(8);

    //step 3
    const BTCUSDT = getTicker("btcusdt");
    const priceUSDT = this.getPriceByUSDT();

    return (Number(priceUSDT) / Number(BTCUSDT)).toFixedNumber(8);
  }

  getPriceByUSD() {
    //step 1
    if (this.currency === "usd") {
      return 1;
    } else if (this.currency === "usdt") {
      const price = PublicController.global_price.USD;
      return Number(price.USDT);
    }

    //step 2
    const allToCheck = ["usd", "usdt", "btc", "eth", "ltc", "xrp"];
    const isAsk = this.currency;
    for (const isBid of allToCheck) {
      const market_found = getTicker(isAsk + isBid);

      if (market_found) {
        return getTickerPriceUSD(market_found.id, Number(market_found.last));
      }
    }

    return 0.00;
  }
}
