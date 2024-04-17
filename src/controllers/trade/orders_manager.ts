import Vue from "vue";
import TradeController from "@/controllers/trade";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export default class OrdersManager {
  state: ZTypes.OrderState | "All" = "All";
  type : "open_orders" | "orders_history";

  headers = reactive({
    page: 1,
    limit: 100,
  })

  config = reactive({
    market: "All",
    ready: false,
    loading: false,
    realtime: true,
  })

  constructor(type: OrdersManager["type"], state?: ZTypes.OrderState | "All") {
    this.type = type;
    if (state) this.state = state;
  }

  get orders() {
    return TradeController.store[this.type];
  }

  set orders(val) {
    TradeController.store[this.type] = val;
  }

  get market() {
    return this.config.market;
  }

  set market(market: string) {
    this.config.market = market;
  }

  get ready() {
    return this.config.ready;
  }

  set ready(ready: boolean) {
    this.config.ready = ready;
  }

  get loading() {
    return this.config.loading;
  }

  set loading(loading: boolean) {
    this.config.loading = loading;
  }

  get realtime() {
    return this.config.realtime;
  }

  set realtime(realtime: boolean) {
    this.config.realtime = realtime;
  }

  async getData(page = this.headers.page, limit = this.headers.limit) {
    if (!this.ready) this.loading = true;

    try {
      const {
        data,
        headers,
      } = await this.getOrders(this.market, this.state, page, limit);

      data.forEach((order: ZTypes.Order) => {
        this.add(order, true);
      });
      this.headers.page = page;
      this.headers.limit = limit;
      this.ready = true;

      return { data, headers };
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      Vue.set(this, "loading", false);
    }
  }

  private getOrders(market?: string, state?: ZTypes.OrderState | "All", page?: number, limit?: number) {
    return TradeController.get_orders({
      market: market !== "All" ? market : undefined,
      state: state !== "All" ? state : undefined,
      page,
      limit
    });
  }

  findIndex(uuid: string) {
    return this.orders.findIndex(order => order.uuid === uuid);
  }

  findPrice(price: string) {
    return this.orders.find(order => Number(order.price) == Number(price));
  }

  find(uuid: string) {
    return this.orders.find(order => order.uuid === uuid);
  }

  delete(uuid: string) {
    const index = this.findIndex(uuid);

    if (index >= 0) {
      Vue.delete(this.orders, index);
    }
  }

  add(order: ZTypes.Order, force = this.realtime && this.ready) {
    if (!force) return false;
    if (this.orders.length == this.headers.limit) {
      if (new Date(order.created_at).getTime() < new Date(this.orders[this.orders.length - 1].created_at).getTime()) return false;
    }
    if (order.market !== this.market && this.market !== "All") return false;
    if (order.state !== this.state && this.state !== "All") return false;

    const index = this.findIndex(order.uuid);
    if (index >= 0) {
      if (new Date(order.updated_at) < new Date(this.orders[index].updated_at)) return;

      Vue.set(this.orders, index, order);
    } else {
      Vue.set(this.orders, this.orders.length, order);
      Vue.set(this, "orders", this.orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    }

    return true;
  }

  resetHeaders() {
    return this.headers = {
      page: 1,
      limit: 100,
    };
  }

  toArray() {
    return this.orders;
  }

  clear() {
    this.resetHeaders();

    this.ready = false;
    this.loading = false;
    this.realtime = false;
    this.orders = [];
  }
}
