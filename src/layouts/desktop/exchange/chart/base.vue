<template>
  <z-card class="page-exchange-chart" title="Chart" :bordered="false">
    <template slot="head">
      <div></div>
      <div class="switch text-right">
        <button
          :class="{ selected: whChart === 'tradingview-chart' }"
          @click="whChart = 'tradingview-chart'"
        >
          Candle
        </button>
        <button
          :class="{ selected: whChart === 'depth-chart' }"
          @click="whChart = 'depth-chart'"
        >
          Depth
        </button>
      </div>
    </template>
    <trading-view-chart
      :class="[
        'page-exchange-chart-item',
        {
          'page-exchange-chart-item-selected': whChart === 'tradingview-chart'
        }
      ]"
    />
    <depth-chart
      ref="depth-chart"
      :class="[
        'page-exchange-chart-item',
        { 'page-exchange-chart-item-selected': whChart === 'depth-chart' }
      ]"
    />
  </z-card>
</template>

<script lang="ts">
import DepthChart from "./depth-chart.vue";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "trading-view-chart": () => import("./tradingview-chart.vue"),
    "depth-chart": DepthChart
  }
})
export default class MainChart extends Vue {
  $refs: {
    "depth-chart": DepthChart;
  };

  whChart = "tradingview-chart";
}
</script>
