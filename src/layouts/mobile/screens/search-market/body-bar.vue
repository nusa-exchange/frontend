<template>
  <div class="search-markets-content z-table z-table-no-scroll">
    <div class="z-table-head">
      <span>Search result</span>
    </div>
    <div class="z-table-content">
      <div
        class="z-table-row"
        v-for="market in findTickers('search', value)"
        :key="market.id"
        @click="$emit('click', market)"
      >
        <span class="text-left name">{{ market.name }}</span>
        <span class="text-left last">
          <span class="price" v-text="market.last" />
          <span class="price-usd">
            ${{ getTickerPriceUSD(market.id, Number(market.last)) }}
          </span>
        </span>
        <span class="text-right chance">
          <div
            :class="[
              getTrend(market.price_change_percent, true),
              getTrend(market.price_change_percent, false)
            ]"
          >
            {{ market.price_change_percent }}
          </div>
        </span>
        <span class="text-right favorite-action">
          <a-icon
            type="star"
            :theme="check_favorite(market.name) ? 'filled' : 'outlined'"
            @click.stop="add_remove_favorite(market.name)"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins, Prop } from "vue-property-decorator";

@Component
export default class SearchMarketScreenBodyBar extends Mixins(MarketMixin) {
  @Prop() readonly value!: string;

  getTickerPriceUSD(market: string, price: number) {
    return helpers.getTickerPriceUSD(market, price);
  }
}
</script>
