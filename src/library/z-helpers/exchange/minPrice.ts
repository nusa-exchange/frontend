import { PublicController, TradeController } from '@/controllers';

export const minPrice = (market = TradeController.market.id) => {
  const markets: ZTypes.Market[] = PublicController.markets;
  const min_price = markets.find(mk => mk.id === market)?.min_price;

  return Number(min_price);
};
