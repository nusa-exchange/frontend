import { PublicController } from '@/controllers';

export const MARKET = () => {
  const MARKET: ZTypes.Market[] = PublicController.markets;

  return MARKET.map(market => market.name);
};
