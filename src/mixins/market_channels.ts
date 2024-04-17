import { TradeController } from '@/controllers';

const RESOLUTION_STREAM = {
  "1": "1m",
  "5": "5m",
  "15": "15m",
  "30": "30m",
  "60": "1h",
  "1D": "1d",
  "1W": "1w"
};

export const MarketChannels = (market: string = TradeController.market.id) => {
  return [
    "depth",
    "trades",
    "kline-" + RESOLUTION_STREAM[TradeController.tradingview.resolution]
  ].map(channel => [market, channel].join("."));
}
