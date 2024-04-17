const buyType = ["buy", "bid", "bids"];

export const SideToClass = (taker_type: ZTypes.OrderSide, bg = false) => {
  if (!bg) return buyType.includes(taker_type) ? "text-up" : "text-down";
  else return buyType.includes(taker_type) ? "bg-up" : "bg-down";
};
