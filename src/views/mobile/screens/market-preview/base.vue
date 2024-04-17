<template>
  <panel-view class="market-preview">
    <head-bar @back="destroy">
      <template v-slot:center>
        <i class="zicon-exchange" /> {{ title }}
      </template>
      <template v-slot:right>
        <div class="right-action">
          <i
            v-if="check_favorite(market.id)"
            class="zicon-star"
            @click="add_remove_favorite(market.id)"
          />
          <i
            v-else
            class="zicon-no-star"
            @click="add_remove_favorite(market.id)"
          />
        </div>
      </template>
    </head-bar>
    <div v-if="panel_ready" class="body-bar">
      <ticker-status :market_id="market_id" />
      <group-chart :market_id="market_id" />
      <group-trade :market_id="market_id" />
    </div>
    <tab-bar :market_id="market_id" />
  </panel-view>
</template>

<script lang="ts">
import TradeController from "@/controllers/trade";
import { Component, Mixins } from "vue-property-decorator";
import { MarketChannels } from "@/mixins";
import { ScreenMixin, MarketMixin } from "@/mixins/mobile";
import { WebSocketController } from "@/controllers";

@Component({
  components: {
    "group-chart": () =>
      import("@/layouts/mobile/screens/market-preview/group-chart"),
    "group-trade": () =>
      import("@/layouts/mobile/screens/market-preview/group-trade"),
    "ticker-status": () =>
      import("@/layouts/mobile/screens/market-preview/ticker-status.vue"),
    "tab-bar": () =>
      import("@/layouts/mobile/screens/market-preview/tab-bar.vue")
  }
})
export default class MarketPreviewScreen extends Mixins(
  ScreenMixin,
  MarketMixin
) {
  market_id = "";
  first_time_render = true;

  get title() {
    return this.market.name.replace("/", " / ");
  }

  async before_panel_create(market_id: string) {
    this.market_id = market_id;

    this.setTitle();
    TradeController.orderbook.clear();
    TradeController.orderbook.fetch(this.market.id);
    TradeController.get_public_trades(this.market.id);

    MarketChannels(this.market.id).forEach(channel => {
      WebSocketController.subscribe("public", channel);
    });
    this.first_time_render = false;
  }

  before_panel_destroy() {
    TradeController.orderbook.clear();
    MarketChannels(this.market.id).forEach(channel => {
      WebSocketController.unsubscribe("public", channel);
    });
  }
}
</script>

<style lang="less">
@import "~@/assets/css/screens/market-preview";
</style>
