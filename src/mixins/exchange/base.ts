import { Vue, Component } from "vue-property-decorator";
import { MarketChannels } from "@/mixins";
import ZSmartModel from "@/library/z-eventbus";
import config from "@/config";

@Component
export class ExchangeBaseMixin extends Vue {
  loading = false;
  identifier = 0;

  mounted() {
    this.onLoad(this.TradeController.market.id);
    ZSmartModel.on("exchange-render", this.forceRerender);
  }

  beforeDestroy() {
    this.removeLoad(this.TradeController.market.id);
  }

  forceRerender(new_market, old_market) {
    this.$nextTick(async () => {
      this.identifier += 1;
      this.removeLoad(old_market);
      this.onLoad(new_market);
    });
  }

  removeLoad(market) {
    this.TradeController.orderbook.clear();
    this.TradeController.trades = [];

    const channels = MarketChannels(market);

    channels.forEach(channel => {
      this.WebSocketController.unsubscribe("public", channel);
    });
  }

  async onLoad(market: string) {
    this.loading = true;
    this.setTitle();
    await Promise.all([
      this.TradeController.orderbook.fetch(market, 500),
      this.TradeController.get_public_trades(market)
    ]);
    this.loading = false;

    MarketChannels().forEach(channel => {
      this.WebSocketController.subscribe("public", channel);
    });
  }

  setTitle() {
    document.title = `${this.TradeController.ticker.last} - ${this.TradeController.market.name.toUpperCase()} - ${
      config.nameEX
    }`;
  }
}