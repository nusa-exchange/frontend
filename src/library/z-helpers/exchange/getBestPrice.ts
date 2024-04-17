import { PublicController, TradeController } from '@/controllers';

export const getBestPrice = (market = TradeController.market.id, side: ZTypes.OrderSide) => {
  const ticker: ZTypes.Ticker = PublicController.tickers[market];

  return ticker[side];
};
