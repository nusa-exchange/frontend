import { PublicController } from "@/controllers";

export function GetTicker(market_id: string) {
  return PublicController.tickers[market_id]
}
