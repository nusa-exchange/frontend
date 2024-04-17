import { PublicController } from '@/controllers';
import { getTicker, getTickerAskSymbol, getTickerBidSymbol } from "./index";

export const getTickerPriceUSD = function getTickerPriceUSD(
  market: string,
  price: number
) {
  let priceFiat = 0.00;
  const selectedFiat = "USD".toUpperCase();
  const GlobalPrice = PublicController.global_price;
  const isBid = getTickerBidSymbol(market);
  const isAsk = getTickerAskSymbol(market);
  const allToCheck = ["btc", "eth", "ltc", "usdt"];

  if (["USD", "USDT"].includes(isBid.toUpperCase())) {
    priceFiat = Number(
      price * GlobalPrice[isBid.toUpperCase()][selectedFiat]
    );
  } else {
    const index_check = allToCheck.findIndex(row => row === isBid);
    const tickerCurrency = {
      asks: getTicker(isAsk + isBid),
      bids: getTicker(isBid + "usdt")
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
          asks: getTicker(isAsk + currency),
          bids: getTicker(currency + "usdt")
        };

        if (tickerCurrency.asks && tickerCurrency.bids) {
          // For the end way
          const asks_last = Number(tickerCurrency.asks.last);
          const bids_last = Number(tickerCurrency.bids.last);
          const ticker_bids_usd = getTickerPriceUSD(
            tickerCurrency.bids.id,
            bids_last
          );
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
