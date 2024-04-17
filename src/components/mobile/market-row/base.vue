<template>
  <div class="z-table-row market-row" @click="$emit('click')">
    <span class="market-row-column">
      <div class="market-row-name">
        <span class="base_unit">{{ market.base_unit.toUpperCase() }}</span>
        <span class="quote_unit">/{{ market.quote_unit.toUpperCase() }}</span>
      </div>
      <div class="market-row-volume">
        Vol: {{ Number(Number(ticker.volume).toFixed(2)).toLocaleString() }}
      </div>
    </span>
    <span class="market-row-column">
      <div class="market-row-price">{{ ticker.last }}</div>
      <div class="market-row-price-usd">
        ${{ getLastPriceUSD(market.id, ticker.last) }}
      </div>
    </span>
    <span class="market-row-column">
      <div
        class="market-row-change"
        :class="[
          getTrend(ticker.price_change_percent),
          getTrend(ticker.price_change_percent, true)
        ]"
      >
        {{ ticker.price_change_percent }}
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component
export default class MarketRow extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;

  getLastPriceUSD(market_id: string, last) {
    return this.helpers.TickerToUSD(market_id, last);
  }
}
</script>

<style lang="less">
.market-row {
  padding: 4px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  line-height: initial;

  > * {
    flex: 1;
  }

  &-name {
    .base_unit {
      font-size: 12px;
    }

    .quote_unit {
      color: var(--color-gray);
      font-size: 9px;
    }
  }

  &-volume {
    color: var(--color-gray);
  }

  &-price {
    font-size: 12px;
    text-align: right;
  }

  &-price-usd {
    font-size: 9px;
    color: var(--color-gray);
    text-align: right;
  }

  &-change {
    padding: 0 8px;
    border-radius: 2px;
    text-align: center;
    line-height: 25px;
    font-size: 12px;
    width: max-content;
    margin-left: auto;
  }
}
</style>
