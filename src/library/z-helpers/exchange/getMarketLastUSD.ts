import { getMarketLastPrice } from "./index";
import { getTickerPriceUSD } from "../index";
import { TradeController } from '@/controllers';

export const getMarketLastUSD = (market = TradeController.market.id) => {
  const last_price = getMarketLastPrice(market);
  return getTickerPriceUSD(market, Number(last_price));
}
