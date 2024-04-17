import { TradeController, UserController } from "@/controllers";
import * as helpers from "@/library/z-helpers";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MineControlMixin extends Vue {
  @Prop() public readonly type_control!: string;

  name!: "open_orders" | "orders_history" | "trades_history";

  isAsk = TradeController.market.base_unit.toUpperCase();
  isBid = TradeController.market.quote_unit.toUpperCase();
  price_precision = helpers.pricePrecision();
  amount_precision = helpers.amountPrecision();
  total_precision = helpers.totalPrecision();

  get mine_control() {
    return TradeController[this.name];
  }

  get checkSession() {
    return UserController.state == "active";
  }

  getDate(time) {
    return helpers.getDate(time);
  }

  getPrice(price) {
    return Number(price).toFixed(this.price_precision);
  }

  getAmount(amount) {
    return Number(amount).toFixed(this.amount_precision);
  }

  getTotal(total) {
    return Number(total).toFixed(this.total_precision);
  }

  getTrend(taker_type) {
    return helpers.trendType(taker_type);
  }
}
