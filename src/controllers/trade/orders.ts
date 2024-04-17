import { runNotice } from "@/mixins";
import ApiClient from "@/library/z-apiclient";
import config from "@/config";

export default abstract class OrdersController {
  async create_order(market_id: string, side: ZTypes.OrderSide, ord_type: ZTypes.OrdType = "limit", price: number | null, stop_price: number | null, amount: number): Promise<ZTypes.Order> {
    try {
      const payload: { [key: string]: any } = {
        market: market_id,
        side: side,
        price: price,
        stop_price: stop_price,
        ord_type: ord_type,
      }

      if (config.finex) {
        payload.quantity = amount
      } else {
        payload.volume = amount
      }

      if (ord_type == "market") {
        delete payload.price
        delete payload.stop_price
      }
      const response = await new ApiClient(config.finex ? "finex" : "trade").post("market/orders", payload);
      runNotice("success", "order.created");

      return response.data;
    } catch (error) {
      return error;
    }
  }

  async stop_order(uuid: string) {
    try {
      await new ApiClient(config.finex ? "finex" : "trade").post("market/orders/#{uuid}/cancel".replace("#{uuid}", uuid.toString()));
      runNotice("success", "order.canceled");

      return true;
    } catch (error) {
      return false;
    }
  }

  async stop_orders(market_id?: string, side?: ZTypes.OrderSide) {
    try {
      await new ApiClient(config.finex ? "finex" : "trade").post("market/orders/cancel", { market: market_id, side: side });
      runNotice("success", "order.canceled.all", { market: market_id });

      return true;
    } catch (error) {
      return false;
    }
  }

  async get_orders(payload: { market: string; state?: ZTypes.OrderState; type?: ZTypes.OrderSide | ""; page?: number; limit?: number; time_from?: number; time_to?: number }) {
    if (!payload.page) payload.page = 1;
    if (!payload.limit) payload.limit = 100;

    return new ApiClient(config.finex ? "finex" : "trade").get("market/orders", payload);
  }

  async get_trades(payload: { market: string; type?: ZTypes.OrderSide; page?: number; limit?: number; time_from?: number; time_to?: number }) {
    if (!payload.page) payload.page = 1;
    if (!payload.limit) payload.limit = 100;

    return new ApiClient(config.finex ? "finex" : "trade").get("market/trades", payload);
  }
}
