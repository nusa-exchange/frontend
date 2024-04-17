import { PublicController, TradeController } from "@/controllers";

export const totalPrecision = (market = TradeController.market.id) => {
  market = market.toLowerCase();
  const markets: ZTypes.Market[] = PublicController.markets;
  const total_precision = markets.find(mk => mk.id === market)?.total_precision;

  return total_precision;
};
