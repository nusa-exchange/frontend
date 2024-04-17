import { PublicController } from '@/controllers';
import { GetTicker } from "./GetTicker";

export function TickerToUSD(market_id: string, price: number | string) {
  if (typeof price === "string") {
    price = parseFloat(price);
  }

  let priceFiat = 0.00;
  const selectedFiat = "USD".toUpperCase();
  const GlobalPrice = PublicController.global_price;
  const market = PublicController.markets.find(market => market.id === market_id)
  const allToCheck = ["btc", "eth", "ltc", "usdt"];

  if (["USD", "USDT"].includes(market.quote_unit.toUpperCase())) {
    priceFiat = Number(
      price * GlobalPrice[market.quote_unit.toUpperCase()][selectedFiat]
    );
  } else {
    const index_check = allToCheck.findIndex(row => row === market.quote_unit);
    const tickerCurrency = {
      asks: GetTicker(market.id),
      bids: GetTicker(market.quote_unit + "usdt")
    };
    if (index_check >= 0 && tickerCurrency.asks && tickerCurrency.bids) {
      const bids_last = Number(tickerCurrency.bids.last);
      priceFiat = Number(
        price *
          bids_last *
          GlobalPrice["USDT"]["USD"] *
          GlobalPrice["USD"][selectedFiat]
      );
    } else {
      for (const currency of allToCheck) {
        const tickerCurrency = {
          asks: GetTicker(market.base_unit + currency),
          bids: GetTicker(currency + "usdt")
        };

        if (tickerCurrency.asks && tickerCurrency.bids) {
          // For the end way
          const asks_last = Number(tickerCurrency.asks.last);
          const bids_last = Number(tickerCurrency.bids.last);
          const ticker_bids_usd = TickerToUSD(tickerCurrency.bids.id,bids_last);
          priceFiat = Number(
            asks_last *
              Number(ticker_bids_usd) *
              GlobalPrice["USDT"]["USD"] *
              GlobalPrice["USD"][selectedFiat]
          );
        } else if (tickerCurrency.asks && currency === "usdt") {
          const asks_last = Number(tickerCurrency.asks.last);
          priceFiat = Number(
            price * asks_last * GlobalPrice["USDT"][selectedFiat]
          );
        }
      }
    }
  }

  return Number(priceFiat).toFixedNumber(2);
};
