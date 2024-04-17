<template>
  <div :id="element_id" />
</template>

<script lang="ts">
import uuid from "uuid/v4";
import TradeController from "@/controllers/trade";
import { ResizeObserver } from 'resize-observer';
import { Chart } from "@/library/depth-chart";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class DepthChart extends Vue {
  @Prop() readonly market_id!: string;
  @Prop() readonly showing!: boolean;
  resize_observer: ResizeObserver;
  element_id = uuid();
  chart!: Chart;

  get orderbook() {
    return TradeController.orderbook;
  }

  get depth() {
    const SIDE = ["bids", "asks"];
    const data: Chart["depth_data"] = { buy: [], sell: [] };

    for (const side of SIDE) {
      let total = 0;
      const depth_by_side = this.orderbook.toArray(
        side as ZTypes.TakerType,
        100
      );
      depth_by_side.forEach(row => {
        const item = {
          price: null,
          volume: null,
          total: null
        };

        total = total + Number(row.amount);
        item.price = Number(row.price);
        item.volume = Number(row.amount);
        item.total = total.toFixedNumber(4);

        data[side === "bids" ? "buy" : "sell"].push(item);
      });
    }

    return {
      buy: data.buy,
      sell: data.sell
    };
  }

  mounted() {
    this.chart = new Chart(this.element_id);
    this.chart.init();

    this.resize_observer = new ResizeObserver(() => {
      this.chart.resize();
    });
    this.resize_observer.observe(this.$el);
    if (this.chart.chart_ready && this.depth) {
      this.chart.depth_data = this.depth;
      this.chart.draw();
    }
  }

  beforeDestroy() {
    this.resize_observer.unobserve(this.$el);
    this.chart.destroy();
  }

  @Watch("depth")
  onDepthChanged(depth) {
    if (this.chart.chart_ready) {
      this.chart.depth_data = depth;
      this.chart.draw();
    }
  }
}
</script>

<style>
.depth-chart canvas {
  position: absolute;
}
</style>
