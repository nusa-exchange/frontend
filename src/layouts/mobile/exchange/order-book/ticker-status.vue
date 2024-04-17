<template>
  <div class="ticker-status">
    <div class="last">
      <p :class="getTrend(percentToNumber(getChange))">{{ getLastPrice }}</p>
      <p class="fiat">≈$ {{ getLastUSD }}</p>
    </div>
    <div :class="['change', getTrend(percentToNumber(getChange))]">
      {{ getChange }}
    </div>
  </div>
</template>

<script>
import { PublicController, TradeController } from "@/controllers";
import * as helpers from "@/library/z-helpers";

export default {
  computed: {
    getLastPrice: () => helpers.getMarketLastPrice(),
    getLastUSD: () => helpers.getMarketLastUSD(),
    getChange() {
      return TradeController.ticker.price_change_percent;
    }
  },
  methods: {
    percentToNumber: value => helpers.percentToNumber(value),
    getTrend: value => helpers.getTrend(value)
  }
};
</script>
