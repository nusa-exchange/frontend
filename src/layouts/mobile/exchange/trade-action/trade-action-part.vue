<template>
  <div class="trade-action-part">
    <trade-action-input
      v-model="price"
      :placeholder="`Price(${market.quote_unit.toUpperCase()})`"
      :precision="price_precision"
    />
    <div class="trade-action-estimate">
      ≈
      {{
        amount_to_usd(currency_by_side("buy"), Number(this.price)).toFixed(2)
      }}
      USD
    </div>
    <trade-action-input
      v-model="amount"
      :placeholder="`Amount(${market.base_unit.toUpperCase()})`"
      :precision="amount_precision"
    />
    <div class="trade-action-amount-picker">
      <span v-for="percent in AMOUNT_PERCENT" :key="percent">
        {{ percent }}%
      </span>
    </div>
    <div class="trade-action-calculate-total">
      Total:
      <span class="trade-action-calculate-total-value">{{ total }}</span>
      ≈
      {{
        amount_to_usd(currency_by_side("buy"), Number(this.price)).toFixed(2)
      }}
      USD
    </div>

    <div class="trade-action-calculate-fee">
      Fee: <span class="trade-action-calculate-fee-value">{{ fee }}</span>
    </div>
    <div
      :class="[
        'trade-action-button',
        { 'trade-action-button-disabled': button_disabled }
      ]"
      @click="create_order"
    >
      {{
        authorized
          ? [
              side === "buy" ? "Buy" : "Sell",
              market.base_unit.toUpperCase()
            ].join(" ")
          : "Login"
      }}
    </div>
    <trade-action-balance :currency_id="currency_by_side(side)" />
  </div>
</template>

<script lang="ts">
import { TradeActionMixin } from "@/mixins";
import { Component, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    "trade-action-input": () => import("./trade-action-input.vue"),
    "trade-action-balance": () => import("./trade-action-balance.vue"),
  }
})
export default class TradeActionPart extends Mixins(TradeActionMixin) {
  get AMOUNT_PERCENT() {
    return Object.keys(this.marks_slider).map(percent => Number(percent));
  }
}
</script>

<style lang="less">

</style>
