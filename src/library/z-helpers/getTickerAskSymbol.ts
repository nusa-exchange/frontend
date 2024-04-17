import { PublicController } from '@/controllers';

export const getTickerAskSymbol = (market: string): string => {
  return PublicController.tickers[market].base_unit;
};
