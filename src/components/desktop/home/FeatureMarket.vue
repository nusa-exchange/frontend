<template>
  <li class="market">
    <router-link :to="{
      name: 'ExchangePage',
      params: { name: market.name.replace('/', '-') },
      query: { type: 'pro' }
    }">
      <span class="rate" :class="GetTrend(ticker.price_change_percent, true)">
        {{ ticker.price_change_percent }}
      </span>
      <h3 class="name">
        <span>{{ market.name.replace('/', ' / ') }}</span>
        <i>{{ market.quote_unit.toUpperCase() }}</i>
      </h3>
      <p class="price">
        <span :class="GetTrend(ticker.price_change_percent, false)">
          {{ Number(ticker.last).toFixed(market.price_precision) }}
        </span>
        <i>≈ ${{ helpers.TickerToUSD(market_id, Number(ticker.last)) }}</i>
      </p>
      <p class="vol">
        <span>{{ $t("page.global.table.24h_volume") }}</span>
        <i>{{ Number(ticker.volume).toFixed(market.price_precision) }} {{ market.quote_unit.toUpperCase() }}</i>
      </p>
      <sparkline :market_id="market_id" />
    </router-link>
  </li>
</template>

<script lang="ts">
import sparkline from "@/components/desktop/home/sparkline.vue";
import { PublicController } from "@/controllers";
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    sparkline
  }
})
export default class FeatureMarket extends Vue {
  @Prop() readonly market_id: string;

  get market() {
    return PublicController.markets.find(market => market.id == this.market_id);
  }

  get ticker() {
    return PublicController.tickers[this.market_id]
  }

  GetTrend(price_change_percent, bg = false) {
    const chance = parseFloat(price_change_percent);
    return this.helpers.GetTrend(chance, bg);
  }

  mounted() {
    this.ticker.volume
  }
}
</script>
