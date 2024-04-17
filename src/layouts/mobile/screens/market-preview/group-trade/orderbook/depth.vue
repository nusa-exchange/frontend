<template>
  <div class="z-table z-table-borderable z-table-no-scroll" :class="side">
    <div class="z-table-content">
      <depth-row
        v-for="(order, i) in depth"
        :key="order.price"
        :maxTotal="maxTotal"
        :price="order.price"
        :amount="order.amount"
        :length="i"
        :side="side"
        :market_id="market.id"
        class="z-table-row"
      />

      <fake-depth-row
        v-for="(fake, i) in fake_row"
        :key="`fake-${i}`"
        :length="i"
        :depth-size="depth.length"
        :side="side"
        class="z-table-row"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { TradeController } from "@/controllers";
import * as helpers from "@/library/z-helpers";
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "depth-row": () => import("./depth-row.vue"),
    "fake-depth-row": () => import("./fake-depth-row.vue")
  }
})
export default class Depth extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;
  @Prop() readonly side!: ZTypes.TakerType;

  min_row = 15;

  get depth() {
    const depth = TradeController.orderbook.toArray(this.side, 15);

    return depth;
  }

  get fake_row() {
    return Array(Math.max(0, this.min_row - this.depth.length));
  }

  get maxTotal() {
    let total = 0;
    this.depth.forEach(row => {
      total += Number(row.price) * Number(row.amount);
    });

    return total;
  }

  trendType(value: ZTypes.OrderSide) {
    return helpers.trendType(value);
  }
}
</script>
