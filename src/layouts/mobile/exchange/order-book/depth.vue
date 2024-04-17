<template>
  <div class="depth" :class="[`depth-${side}`]">
    <div :style="style">
      <template v-if="side == 'asks'">
        <fake-depth-row
          v-for="(fake, i) in fake_row"
          :key="`fake-${i}`"
          :side="side"
          class="z-table-row"
        />
      </template>
      <depth-row
        v-for="(order, index) in depth"
        :key="index"
        class="z-table-row"
        :price="order.price"
        :amount="order.amount"
        :side="side"
        :max-total="maxTotal"
        :market_id="market.id"
        @click="on_depth_clicked(order)"
      />
      <template v-if="side == 'bids'">
        <fake-depth-row
          v-for="(fake, i) in fake_row"
          :key="`fake-${i}`"
          :side="side"
          class="z-table-row"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { TradeController } from "@/controllers";
import { Component, Prop, Mixins } from "vue-property-decorator";
import * as helpers from "@/library/z-helpers";
import ZSmartModel from "@/library/z-eventbus";
import { MarketMixin } from "@/mixins/mobile";

@Component({
  components: {
    "depth-row": () => import("./depth-row.vue"),
    "fake-depth-row": () => import("./fake-depth-row.vue")
  }
})
export default class MarketDepth extends Mixins(MarketMixin) {
  @Prop() readonly side!: "asks" | "bids";

  min_row = 6;

  get fake_row() {
    return Array(Math.max(0, this.min_row - this.depth.length));
  }

  get orderbook() {
    return TradeController.orderbook;
  }

  get maxTotal() {
    let total = 0;
    this.depth.forEach(row => {
      total += Number(row.price) * Number(row.amount);
    });

    return total;
  }

  get style() {
    return this.side === "bids"
      ? "position: absolute;width: 100%;top: 0;"
      : "position: absolute;width: 100%;bottom: 0;";
  }

  get depth() {
    const orderbook = this.orderbook;
    const depth = orderbook.toArray(this.side, 6);
    return this.side === "bids" ? depth : depth.reverse();
  }

  trendType(type) {
    return helpers.trendType(type);
  }

  on_depth_clicked(order: { price: string; amount: string }) {
    const price = order.price;
    const orders = this.depth;
    const index = orders.findIndex(ord => ord.price === order.price);
    let orders_with_range: { price: string; amount: string }[];

    if (index < 0) return;

    if (this.side === "bids") {
      orders_with_range =
        index === 0 ? [orders[0]] : orders.slice(0, index + 1);
    } else {
      orders_with_range =
        index === orders.length - 1
          ? [orders[orders.length - 1]]
          : orders.slice(index, orders.length);
    }

    const amount = orders_with_range
      .map(order => order.amount)
      .reduce((previousValue, currentValue) => (Number(previousValue) + Number(currentValue)).toFixed(this.market.amount_precision));

    ZSmartModel.emit("depth-click", price, amount);
  }

  getPrice(price: number) {
    return price.toFixed(this.market.price_precision);
  }

  getAmount(amount: number) {
    return amount.toFixed(this.market.amount_precision);
  }
}
</script>
