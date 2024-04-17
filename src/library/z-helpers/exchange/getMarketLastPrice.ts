import { PublicController, TradeController } from '@/controllers';
import { pricePrecision } from "./pricePrecision";

export const getMarketLastPrice = (market = TradeController.market.id) => {
  const ticker = PublicController.tickers[market];
  const price_precision = pricePrecision(market);

  if (!price_precision) return Number(ticker.last);

  return Number(ticker.last).toFixedNumber(price_precision);
};
