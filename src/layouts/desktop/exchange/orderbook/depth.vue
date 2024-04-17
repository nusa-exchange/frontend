<template>
  <div class="depth" :class="side">
    <z-loading v-if="loading" />
    <depth-overlay
      ref="overlay"
      :side="side"
      :depth="depth"
      :orders_best_range="orders_best_range"
    />
    <div :style="style + 'display: flex;'" :id="id" />

    <div class="depth-hover" :style="style">
      <depth-hover-row
        v-for="(_, index) in count"
        :key="index"
        :ref="`depth-row-${index}`"
        @click="on_depth_clicked(index)"
        @mouseover="on_depth_hover(index)"
        @mouseleave="on_depth_leave_hover()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import uuid from "uuid/v4";
import TradeController from "@/controllers/trade";
import DepthOverLay from "./depth-overlay.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ZSmartModel from "@/library/z-eventbus";
import OrderBookTable from "@/library/orderbook-table";
import colors from "@/colors";

@Component({
  components: {
    "depth-overlay": () => import("./depth-overlay.vue"),
    "depth-hover-row": () => import("./depth-hover-row.vue")
  }
})
export default class MarketDepth extends Vue {
  @Prop() readonly side!: "asks" | "bids";

  id = uuid();
  count = 50;
  table: OrderBookTable;

  $refs!: {
    overlay: DepthOverLay;
  };

  get orderbook() {
    return TradeController.orderbook;
  }

  get loading() {
    return this.orderbook.loading;
  }

  get overlay_mouse_event() {
    return this.$refs["overlay"].mouse_event;
  }

  get market() {
    return TradeController.market;
  }

  get maxSum() {
    let i = 0;
    let total = 0;
    for (const row of this.depth) {
      if ((row as any).fake) {
        continue;
      }

      total += Number(row.price) * Number(row.amount);
      i++
      if (i >= 35) {
        break;
      }
    }

    return total;
  }

  get style() {
    return this.side === "bids"
      ? "position: absolute;width: 100%;top: 0;"
      : "position: absolute;width: 100%;bottom: 0;";
  }

  get depth(): { price: string; amount: string; fake: boolean; }[] {
    let depth: any = this.orderbook.toArray(this.side);
    depth = depth.slice(0, this.count);
    const depth_size = depth.length;

    for (let index = 0; index < this.count - depth_size; index++) {
      depth.push({
        fake: true,
      })
    }

    return this.side === "bids" ? depth : depth.reverse();
  }

  async mounted() {
    this.table = new OrderBookTable(this.id, {
      height: 1000,
      width: 320,
      line_height: 20,
      columns: [
        {
          key: "price",
          color: this.side === "bids" ? colors["up-color"] : colors["down-color"],
          fontSize: 12,
          align: "left",
          x: 16,
        },
        {
          key: "amount",
          color: colors["text-default-color"],
          fontSize: 12,
          align: "right",
          x: (320 / 3 * 2) - 8,
        },
        {
          key: "total",
          color: colors["text-default-color"],
          fontSize: 12,
          align: "right",
          x: 320 - 16,
        }
      ]
    })

    this.table.init();
    this.draw_depth(this.depth);
  }

  orders_best_range(index: number) {
    const orders = this.depth;

    if (!orders.length) return [];

    if (index < 0) return;

    if (this.side === "bids") {
      return orders.slice(0, index + 1).filter(row => !row.fake).filter(row => !row.fake);
    } else {
      return orders.slice(index, orders.length).filter(row => !row.fake);
    }
  }

  on_depth_clicked(index: number) {
    const orders_with_range = this.orders_best_range(index);
    let price: string;

    if (this.side == "bids") {
      price = orders_with_range[orders_with_range.length - 1].price
    } else {
      price = orders_with_range[0].price
    }

    ZSmartModel.emit(
      "depth-click",
      price,
      orders_with_range
        .map(order => order.amount)
        .reduce((previousValue, currentValue) => (Number(previousValue) + Number(currentValue)).toFixed(this.market.amount_precision))
    );
  }

  on_depth_hover(index: number) {
    const element_hover = this.$refs[`depth-row-${index}`][0].$el;
    const DOMRect: DOMRect = element_hover.getBoundingClientRect();

    this.$refs["overlay"].create(index, DOMRect);
  }

  on_depth_leave_hover() {
    this.$refs["overlay"].destroy();
  }

  draw_depth(depth: MarketDepth["depth"]) {
    this.table.setData(
      depth.map((row: any) => {
        row["price"] = Number(row["price"]).toFixed(this.market.price_precision);
        row["amount"] = Number(row["amount"]).toFixed(this.market.amount_precision);
        row["total"] = (Number(row["price"]) * Number(row["amount"])).toFixed(this.market.total_precision);
        row["backgroundWidth"] = 320 / 100 * Math.min((Number(row["total"]) / this.maxSum) * 100 * 3, 100);
        row["backgroundColor"] = this.side === "bids" ? colors["up-bg-color"] : colors["down-bg-color"];

        return row;
      })
    )

    this.table.draw_table();
  }

  @Watch("depth")
  @Watch("TradeController.open_orders.orders")
  async onDepthChanged() {
    this.draw_depth(this.depth);
  }
}
</script>
