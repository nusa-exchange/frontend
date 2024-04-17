<template>
  <div class="orderbook">
    <div class="orderbook-head">
      <span class="length">Buy</span>
      <span class="text-left">Volume({{ market.base_unit.toUpperCase() }})</span>
      <span class="text-center">Price({{ market.quote_unit.toUpperCase() }})</span>
      <span class="text-right">Volume({{ market.base_unit.toUpperCase() }})</span>
      <span class="length text-right">Sell</span>
    </div>
    <div class="orderbook-content">
      <depth v-for="side in SIDE" :key="side" :market_id="market.id" :side="side" />
    </div>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Component, Prop, Mixins } from "vue-property-decorator";

@Component({
  components: {
    depth: () => import("./depth.vue")
  }
})
export default class OrderBook extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;

  SIDE = ["bids", "asks"];
}
</script>
