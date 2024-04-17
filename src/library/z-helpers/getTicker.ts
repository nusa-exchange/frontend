import { PublicController } from '@/controllers';
import store from "@/store";

export const getTicker = (name: string | string[] | { asks: string, bids: string }) => {
  let market: string;
  const tickers: ZTypes.Tickers = PublicController.tickers;
  if (Array.isArray(name)) {
    market = name.join("").toLowerCase();
  } else if (typeof name === "object") {
    market = [name.asks, name.bids].join("").toLowerCase();
  } else {
    name = name.replace(" ", "");
    name = name.replace("/", "");
    market = name.toLowerCase();
  }
  return tickers[market];
};
