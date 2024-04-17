const buyType = ["buy", "bids"];
export const getType = (type: ZTypes.OrderSide) => (buyType.includes(type) ? "Buy" : "Sell");
