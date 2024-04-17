import { TradeController, PublicController } from '@/controllers';

export const getMarketPriceChange = (market = TradeController.market.id) => {
  const ticker = PublicController.tickers[market];
  if (ticker) {
    const change = ticker.price_change_percent;
    return Number(change.replace("%", ""));
  }
  return 0;
};
