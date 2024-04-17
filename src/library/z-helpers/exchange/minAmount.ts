import { PublicController, TradeController } from '@/controllers';

export const minAmount = (market = TradeController.market.id) => {
  const markets: ZTypes.Market[] = PublicController.markets;
  const min_amount = markets.find(mk => mk.id === market)?.min_amount;

  return Number(min_amount);
};
