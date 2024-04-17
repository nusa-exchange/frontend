import { PublicController, TradeController } from '@/controllers';

export const pricePrecision = (market = TradeController.market.id) => {
  market = market.toLowerCase();
  const markets: ZTypes.Market[] = PublicController.markets;
  const price_precision = markets.find(mk => mk.id === market)?.price_precision;

  return price_precision;
};
