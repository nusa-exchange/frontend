<template>
  <router-link
    :to="{
      name: 'ExchangePage',
      params: { name: ticker.name.replace('/', '-') },
      query: { type: TradeController.exchange_layout }
    }"
  >
    <p>
      <i
        v-if="!check_favorite(ticker.name)"
        class="zicon-no-star"
        @click.prevent="add_remove_favorite(ticker.name)"
      />
      <i
        v-else
        class="zicon-star"
        @click.prevent="add_remove_favorite(ticker.name)"
      />
      <span class="text-left">{{ ticker.name }}</span>
      <span
        class="text-left last"
        :class="getTrend(ticker.price_change_percent)"
      >
        {{ ticker.last }}
        <i class="price-usd">
          ≈ $
          {{
            getLastPriceUSD(ticker.base_unit + ticker.quote_unit, ticker.last)
          }}
        </i>
      </span>
      <span
        class="text-left"
        :class="getTrend(ticker.price_change_percent)"
        v-text="ticker.price_change_percent"
      />
      <span class="text-left">{{ ticker.high }}</span>
      <span class="text-left">{{ ticker.low }}</span>
      <span class="text-left">
        {{ Number(ticker.volume).toLocaleString() }}
      </span>
    </p>
  </router-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PublicController, TradeController } from "@/controllers";
import * as helpers from "@/library/z-helpers";

@Component
export default class MarketListRow extends Vue {
  @Prop() readonly ticker!: ZTypes.Ticker;

  check_favorite(market_id: string) {
    return PublicController.helpers.check_favorite(market_id);
  }

  add_remove_favorite(market_id: string) {

    PublicController.helpers.add_remove_favorite(market_id);
  }

  getLastPriceUSD(market_id: string, price: number) {
    return helpers.getTickerPriceUSD(market_id, price);
  }

  getTrend(price_change_percent) {
    const chance = price_change_percent.split("%")[0];
    return chance >= 0 ? "text-up" : "text-down";
  }

  MarketJoin(market: ZTypes.Market) {
    TradeController.open_exchange(market.id);
  }
}
</script>
