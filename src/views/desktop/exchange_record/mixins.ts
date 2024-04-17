import * as helpers from "@/library/z-helpers";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ExchangeRecordMixins extends Vue {
  getData?(page?: number): Promise<any>;

  TYPE = ["All", "Buy", "Sell"];
  STATUS = ["All", "Waiting", "Filled", "Canceled"];
  market = "All";
  input_market = "All";
  input_changed = false;
  status = "All";
  type: ZTypes.OrderSide | "All" = "All";
  loading = false;
  array = {
    data: [],
    page: 1,
    max: 0
  };

  find_market(market_id: string) {
    return this.PublicController.markets.find(market => market.id === market_id);
  }

  price_precision(market_id: string) {
    const market = this.find_market(market_id);

    return market.price_precision;
  }

  amount_precision(market_id: string) {
    const market = this.find_market(market_id);

    return market.amount_precision;
  }

  total_precision(market_id: string) {
    const market = this.find_market(market_id);

    return market.total_precision;
  }

  getPrice(price: string | number, market_id: string) {
    return Number(price).toFixed(this.price_precision(market_id));
  }

  getAmount(amount: string | number, market_id: string) {
    return Number(amount).toFixed(this.amount_precision(market_id));
  }

  getTotal(total: string | number, market_id: string) {
    return Number(total).toFixed(this.total_precision(market_id));
  }

  trendType(type: ZTypes.OrderSide) {
    return helpers.trendType(type);
  }

  getDate(date: any) {
    return helpers.getDate(date, true);
  }

  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text
        .toUpperCase()
        .indexOf(input.toUpperCase()) >= 0
    );
  }

  filterMethod(value, option) {
    if (!this.input_changed) return true;
    return option.toUpperCase().includes(value.toUpperCase());
  }

  mounted() {
    this.getData();
  }
}
