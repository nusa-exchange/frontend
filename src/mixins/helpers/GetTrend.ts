import { SideToClass } from "./SideToClass";

export const GetTrend = (value: string | number | boolean, bg = false) => {
  if (typeof value === "number") {
    return SideToClass(value >= 0 ? "buy" : "sell", bg);
  } else {
    return SideToClass(value ? "buy" : "sell", bg);
  }
};
