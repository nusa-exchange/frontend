import { convertArrayToObject } from "./convertArrayToObject";
import { PublicController } from '@/controllers';

export const marketFilter = (market: string) => {
  const MARKETS: { [key: string]: ZTypes.Market } = convertArrayToObject(PublicController.markets, "id");

  return MARKETS[market];
};
