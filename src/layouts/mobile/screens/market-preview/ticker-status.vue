<template>
  <div class="ticker-status">
    <div class="ticker-status-panel">
      <div class="ticker-status-last-price">{{ last_price }}</div>
      <div class="ticker-status-last-price-fiat">
        <span>{{ last_price_usd }}$</span>
        <span :class="last_trend" style="margin-left: 8px;">{{ ticker.price_change_percent }}</span>
      </div>
    </div>
    <div class="ticker-status-panel" style="text-align: right;">
      <div class="ticker-status-row">
        <div class="ticker-status-roi">
          <div class="ticker-status-roi-title">
            High
          </div>
          <div class="ticker-status-roi-value text-up">
            {{ high_price }}
          </div>
        </div>
        <div class="ticker-status-roi">
          <div class="ticker-status-roi-title">
            Low
          </div>
          <div class="ticker-status-roi-value text-down">
            {{ low_price }}
          </div>
        </div>
      </div>

      <div class="ticker-status-row">
        <div class="ticker-status-roi">
          <div class="ticker-status-roi-title">
            Volume({{ ticker.quote_unit.toUpperCase() }})
          </div>
          <div class="ticker-status-roi-value">
            {{ volume }}
          </div>
        </div>
        <div class="ticker-status-roi">
          <div class="ticker-status-roi-title">
            Amount({{ ticker.base_unit.toUpperCase() }})
          </div>
          <div class="ticker-status-roi-value">
            {{ amount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import * as helpers from "@/library/z-helpers";
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop } from "vue-property-decorator";
import { PublicController } from "@/controllers";

@Component
export default class Depth extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;

  get ticker() {
    const ticker = PublicController.tickers[this.market.id];
    return ticker;
  }

  get last_price() {
    return this.getPrice(this.ticker.last);
  }

  get last_price_usd() {
    return helpers.getMarketLastUSD(this.market.id);
  }

  get high_price() {
    return this.getPrice(this.ticker.high);
  }

  get low_price() {
    return this.getPrice(this.ticker.low);
  }

  get volume() {
    return Number(this.getAmount(this.ticker.volume)).toLocaleString();
  }

  get amount() {
    return Number(this.getAmount(this.ticker.amount)).toLocaleString();
  }

  get last_trend() {
    const change = parseInt(this.ticker.price_change_percent);
    return helpers.getTrend(change);
  }
}
</script>
