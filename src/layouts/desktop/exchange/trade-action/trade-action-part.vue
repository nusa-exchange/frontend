<template>
  <div class="trade-action-part" :class="{ 'trade-action-part-market': ord_type == 'market' }">
    <trade-action-balance :currency="currency" />
    <trade-action-input
      v-if="ord_type == 'limit' && isStop"
      class="stop_price"
      v-model="stop_price"
      :prefix="$t('page.global.placeholder.stop').toUpperCase()"
      :suffix="currency_by_side('buy').toUpperCase()"
      :estimate-value="
        amount_to_usd(currency_by_side('buy'), Number(this.price)).toFixed(2)
      "
      :error="stop_price_error"
    />
    <trade-action-input
      v-if="ord_type == 'limit'"
      class="price"
      v-model="price"
      :prefix="$t(isStop ? 'page.global.placeholder.limit' : 'page.global.placeholder.price').toUpperCase()"
      :suffix="currency_by_side('buy').toUpperCase()"
      :estimate-value="
        amount_to_usd(currency_by_side('buy'), Number(this.price)).toFixed(2)
      "
      :error="price_error"
    />
    <trade-action-input
      v-else
      class="price"
      :value="this.translation('ord_type.market')"
      :prefix="$t('page.global.placeholder.price').toUpperCase()"
      :suffix="currency_by_side('buy').toUpperCase()"
      :estimate-value="
        amount_to_usd(currency_by_side('buy'), Number(this.price)).toFixed(2)
      "
      :error="price_error"
      :disabled="ord_type == 'market'"
    />
    <trade-action-input
      class="amount"
      v-model="amount"
      :prefix="$t('page.global.placeholder.amount').toUpperCase()"
      :suffix="currency_by_side('sell').toUpperCase()"
      :error="amount_error"
    />
    <a-slider
      v-model="slider_percent"
      :class="class_by_side('trade-action-slider')"
      :marks="marks_slider"
      :step="1"
      :default-value="0"
      :disabled="slider_disabled"
    />
    <div class="total">
      {{ $t('page.global.placeholder.total') }}:
      <span class="value">
        {{ (total || 0).toFixed(total_precision) }}
        {{ currency_by_side("buy").toUpperCase() }}
      </span>
      ≈ ${{ amount_to_usd(currency_by_side("buy"), total).toFixed(2) }}
    </div>
    <button
      :class="class_by_side('trade-action-button')"
      :disabled="button_disabled"
      @click="create_order"
    >
      {{
        translation(side, {
          currency: currency_by_side("sell").toUpperCase()
        })
      }}
    </button>
  </div>
</template>

<script lang="ts">
import { TradeActionMixin } from "@/mixins";
import { Mixins, Component } from "vue-property-decorator";

@Component({
  components: {
    "trade-action-balance": () => import("./trade-action-balance.vue"),
    "trade-action-input": () => import("./trade-action-input.vue")
  }
})
export default class TradeActionPart extends Mixins(TradeActionMixin) {
  get slider_disabled() {
    return !this.assets.available;
  }

  class_by_side(class_name: string) {
    return class_name + " " + class_name + "-" + this.side;
  }
}
</script>
