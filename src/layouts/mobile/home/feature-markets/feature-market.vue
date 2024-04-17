<template>
  <div class="feature-markets-item" @click="$emit('click', market)">
    <div class="feature-markets-title">
      <span class="feature-markets-name">
        {{ market.name.replace("/", " / ") }}
      </span>
      <span
        class="feature-markets-change"
        :class="getTrend(ticker.price_change_percent)"
      >
        {{ ticker.price_change_percent }}
      </span>
    </div>
    <div
      class="feature-markets-price"
      :class="getTrend(ticker.price_change_percent)"
    >
      {{ Number(ticker.last).toLocaleString() }}
    </div>
    <div class="feature-markets-price-usd">≈ ${{ last_usd }}</div>
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins, Prop } from "vue-property-decorator";

@Component
export default class FeatureMarket extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;

  get last_usd() {
    return helpers
      .getTickerPriceUSD(this.market.id, Number(this.ticker.last))
      .toLocaleString();
  }
}
</script>
