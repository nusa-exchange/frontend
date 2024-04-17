import { TradeController, PublicController } from '@/controllers';

export const amountPrecision = (market = TradeController.market.id) => {
  market = market.toLowerCase();
  const markets: ZTypes.Market[] = PublicController.markets;
  const amount_precision = markets.find(mk => mk.id === market)?.amount_precision;

  return amount_precision;
};
