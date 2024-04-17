import { PublicController } from '@/controllers';

export const getTickerBidSymbol = (market: string): string => {
  return PublicController.tickers[market].quote_unit;
};
