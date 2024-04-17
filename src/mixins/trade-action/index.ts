import { PublicController, UserController, TradeController } from '@/controllers';
import ZSmartModel from "@/library/z-eventbus";
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { IsMobile } from "@/mixins";
import * as helpers from "@/library/z-helpers";

@Component
export class TradeActionMixin extends Vue {
  @Prop() readonly side!: ZTypes.OrderSide;
  @Prop({ default: "limit" }) readonly ord_type!: ZTypes.OrdType;
  @Prop() readonly isStop!: boolean;

  loading = false;
  price = "";
  stop_price = "";
  amount = "";
  marks_slider = {
    0: "",
    25: "",
    50: "",
    75: "",
    100: ""
  };

  get slider_percent() {
    return Number(this.amount) * 100 / this.max_amount;
  }

  set slider_percent(percent: number) {
    this.amount = (this.max_amount * percent / 100).toString();
  }

  get authorized() {
    return UserController.state == "active";
  }

  get currency() {
    return this.side === "sell" ? this.market.base_unit : this.market.quote_unit;
  }

  get market() {
    return TradeController.market;
  }

  get min_amount() {
    return Number(this.market.min_amount);
  }

  get min_price() {
    return Number(this.market.min_price);
  }

  get price_precision() {
    return this.market.price_precision;
  }

  get amount_precision() {
    return this.market.amount_precision;
  }

  get total_precision() {
    return this.market.total_precision;
  }

  get total() {
    const price = Number(this.price);
    const amount = Number(this.amount);

    return (price * amount).toFixedNumber(this.total_precision);
  }

  get max_amount() {
    const balance = Number(this.assets.available);
    const price = Number(this.price);

    return this.side === "buy" ? balance / price : balance;
  }

  get fee() {
    const ANY = "any";
    const total = this.total;
    const { total_precision } = this;
    const trading_fees = PublicController.trading_fees;
    const user_role = UserController.role;

    const trading_fee =
      trading_fees.find(trading_fee => {
        const rule1 = trading_fee.group === user_role;
        const rule2 =
          trading_fee.market_id === this.market.id ||
          trading_fee.market_id === ANY;

        return rule1 && rule2;
      }) ||
      trading_fees.find(trading_fee => {
        return (
          (trading_fee.group === ANY &&
            trading_fee.market_id === this.market.id) ||
          trading_fee.market_id === ANY
        );
      });

    return (
      Number(trading_fee[this.side === "buy" ? "maker" : "taker"]) * total
    ).toFixed(total_precision);
  }

  get price_error() {
    if (!this.price.length) {
      return false;
    }
    if (Number(this.price) < this.min_price) {
      return "Price too low";
    }
  }

  get stop_price_error() {
    if (!this.stop_price.length) {
      return false;
    }
    if (Number(this.stop_price) < this.min_price) {
      return "Stop price too low";
    }
  }

  get amount_error() {
    if (!this.amount.length) {
      return false;
    }
    if (Number(this.amount) < this.min_amount) {
      return "Amount too low";
    }
  }

  get button_disabled() {
    if (this.price_error) return true;
    if (this.amount_error) return true;
    if (this.stop_price_error) return true;
    if (this.loading) return true;
    if (this.ord_type == "limit" && !this.price.length) return true;
    if (!this.stop_price.length && this.isStop) return true;
    if (!this.amount.length) return true;

    return false;
  }

  get assets() {
    const currency = this.currency_by_side(this.side);

    return new helpers.Balance(currency);
  }

  mounted() {
    ZSmartModel.on("depth-click", this.on_book_click);
  }

  beforeDestroy() {
    ZSmartModel.remove("depth-click", this.on_book_click);
  }

  on_book_click(price: string, amount: string) {
    this.price = price;
    this.amount = amount
  }

  currency_by_side(side) {
    return TradeController.market[side === "sell" ? "base_unit" : "quote_unit"].toUpperCase();
  }

  translation(message, data = {}) {
    return helpers.translation("page.exchange.trade_action." + message, data);
  }

  amount_to_usd(currency_id: string, amount: number) {
    const price_by_usd = currency_id.toLowerCase() == "usd" ? 1 : new helpers.Currency(currency_id).getPriceByUSD();

    return price_by_usd * amount;
  }

  async create_order() {
    if (!this.authorized) {
      if (IsMobile()) {
        ZSmartModel.emit("need-login");
      }

      return;
    }

    this.loading = true;
    await TradeController.create_order(
      this.market.id,
      this.side,
      this.ord_type,
      this.ord_type == "limit" ? Number(this.price) : null,
      this.isStop ? Number(this.stop_price) : null,
      Number(this.amount)
    );
    this.loading = false;
  }

  round_precision(value: string, precision: number) {
    const value_with_split = value.split(".");
    const n1 = value_with_split[0];
    const n2 = value_with_split[1];

    if (precision === 0) {
      return n1;
    } else if (n2.length) {
      return [n1, n2.slice(0, precision)].join(".");
    } else {
      return value;
    }
  }

  @Watch("price")
  onPriceChange() {
    this.price = this.round_precision(this.price, this.price_precision);
    if (this.side === "buy") this.FixAmount();
  }

  @Watch("amount")
  onAmountChange() {
    if (!this.amount) return;

    if (this.side === "buy" && !this.price && this.TradeController.orderbook?.book.asks.length) {
      this.price = this.TradeController.orderbook?.book.asks[0].price;
    }

    this.FixAmount();
  }

  FixAmount() {
    this.amount = this.round_precision(this.amount, this.market?.amount_precision as number);

    if (Number(this.amount) > this.max_amount) {
      this.amount = this.max_amount.toString();
    }
  }
}
