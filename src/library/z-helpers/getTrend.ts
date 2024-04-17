import { trendType } from "./exchange/trendType";

export const getTrend = (value: string | number | boolean, bg = false) => {
  if (typeof value === "number") {
    return trendType(value >= 0 ? "buy" : "sell", bg);
  } else {
    return trendType(value ? "buy" : "sell", bg);
  }
};
