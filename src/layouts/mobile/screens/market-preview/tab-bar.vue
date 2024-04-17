<template>
  <div class="tab-bar">
    <button class="bg-up" @click="openTradesPage('buy')">
      BUY
    </button>
    <button class="bg-down" @click="openTradesPage('sell')">
      SELL
    </button>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { MarketMixin } from "@/mixins/mobile";
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";
import ZSmartModel from "@/library/z-eventbus";
import { PublicController, TradeController } from "@/controllers";

@Component
export default class MarketPreviewTabBar extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;

  openTradesPage(type) {
    const market = [this.market.base_unit, this.market.quote_unit].join("_");

    ZSmartModel.emit("close-panel-view");
    setTimeout(() => {
      TradeController.open_exchange(this.market.id, type);
    }, 300);
  }
}
</script>
