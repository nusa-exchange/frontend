<template>
  <search-screen
    class="search-markets"
    v-model="value"
    :data="findTickers('search', value)"
    :head-text="value ? 'Search result' : ''"
    :hidden="!value"
    @click="open_market_preview_screen"
  >
    <template slot-scope="{ item }">
      <span class="text-left name">{{ item.name }}</span>
      <span class="text-left last">
        <span class="price" v-text="item.last" />
        <span class="price-usd">
          ${{ getTickerPriceUSD(item.id, Number(item.last)) }}
        </span>
      </span>
      <span class="text-right chance">
        <div
          :class="[
            getTrend(item.price_change_percent, true),
            getTrend(item.price_change_percent, false)
          ]"
        >
          {{ item.price_change_percent }}
        </div>
      </span>
      <span class="text-right favorite-action">
        <a-icon
          type="star"
          :theme="check_favorite(item.name) ? 'filled' : 'outlined'"
          @click.stop="add_remove_favorite(item.name)"
        />
      </span>
    </template>
  </search-screen>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { SearchScreenMixin, MarketMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "search-screen": () => import("@/views/mobile/screens/search")
  }
})
export default class SearchMarketScreen extends Mixins(
  SearchScreenMixin,
  MarketMixin
) {
  value = "";

  open_market_preview_screen(_key, market: ZTypes.Market) {
    this.$emit("click", market);
  }

  getTickerPriceUSD(market: string, price: number) {
    return helpers.getTickerPriceUSD(market, price);
  }
}
</script>

<style lang="less">
@import "~@/assets/css/screens/search-markets";
</style>
