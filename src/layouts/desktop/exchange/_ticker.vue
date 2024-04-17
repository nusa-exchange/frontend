<template>
  <div class="ticker-info">
    <a-icon
      v-if="!buttonHideMarketList"
      :class="['icon-hide-pairs', { 'active': hide_pairs_table }]"
      type="arrow-left"
      @click="update_hide_pairs_table"
    />
    <span class="ticker-name">{{ market.base_unit.toUpperCase() }}/{{ market.quote_unit.toUpperCase() }}</span>
    <div class="ticker-status">
      <div class="price">
        <span class="now-price" :class="getLastTrend" v-text="Number(ticker.last).toFixed(market.price_precision)" />
        <span>≈ {{ getPrice_USD.toFixed(2) }} USD</span>
      </div>
      <dl class="change">
        <dt v-text="$t('page.global.table.24h_change')" />
        <dt class="value" :class="getLastTrend" v-text="getChange" />
      </dl>
      <dl class="high">
        <dt v-text="$t('page.global.table.24h_high')" />
        <dt class="value" v-text="getHighPrice" />
      </dl>
      <dl class="low">
        <dt v-text="$t('page.global.table.24h_low')" />
        <dt class="value" v-text="getLowPrice" />
      </dl>
      <dl class="amount">
        <dt v-text="$t('page.global.table.24h_amount')" />
        <dt class="value" v-text="getAmount" />
      </dl>
      <dl class="volume">
        <dt v-text="$t('page.global.table.24h_volume')" />
        <dt class="value" v-text="getVolume" />
      </dl>
    </div>
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop() readonly buttonHideMarketList!: boolean;
  @Prop() hide_pairs_table!: boolean;

  get market() {
    return this.TradeController.market;
  }

  get ticker() {
    return this.TradeController.ticker;
  }

  get getLastTrend() {
    return helpers.getMarketPriceChange() >= 0 ? "text-up" : "text-down";
  }

  get getChange() {
    return this.ticker.price_change_percent;
  }

  get getPrice_USD() {
    return helpers.getMarketLastUSD();
  }

  get getHighPrice() {
    const ticker = this.ticker
    const last_price = helpers.getMarketLastPrice();
    return last_price > Number(ticker.high)
      ? helpers.getMarketLastPrice()
      : Number(ticker.high).toFixed(helpers.pricePrecision());
  }

  get getLowPrice() {
    const ticker = this.ticker
    return helpers.getMarketLastPrice() < Number(ticker.low)
      ? helpers.getMarketLastPrice()
      : Number(ticker.low).toFixed(helpers.pricePrecision());
  }

  get getAmount() {
    const ticker = this.ticker
    return (
      Number(
        Number(ticker.amount).toFixed(helpers.pricePrecision())
      ).toLocaleString() +
      " " +
      this.market.base_unit.toUpperCase()
    );
  }

  get getVolume() {
    const ticker = this.ticker
    return (
      Number(
        Number(ticker.volume).toFixed(helpers.pricePrecision())
      ).toLocaleString() +
      " " +
     this.market.quote_unit.toUpperCase()
    );
  }

  update_hide_pairs_table() {
    this.$emit("update-hide", !this.hide_pairs_table);
  }

  translation(message, data = {}) {
    return helpers.translation("exchange." + message, data);
  }
}
</script>

<style lang="less">
.icon-hide-pairs {
  padding: 0 !important;
  transition: 0.70s;

  &.active {
    transform: rotate(180deg);
  }
}

.ticker-name {
  margin-left: 12px !important;
}
</style>
