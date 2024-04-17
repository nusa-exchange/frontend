<template>
  <div class="group-chart">
    <div class="head-bar">
      <cube-tab-bar
        v-model="selected"
        show-slider
        slider-big
        class="chart-picker"
      >
        <template v-for="tab in tabs">
          <cube-tab
            v-if="tab.label === 'time-picker'"
            class="picker time-picker"
            :label="tab.label"
            :key="tab.label"
          >
            <i slot="icon" v-show="false" />
            <span class="text" v-if="selected !== 'time-picker'">
              {{ kline_times[kline_resolution].title }}
              <i class="zicon-caret-down" />
            </span>
            <a-dropdown
              v-else
              v-model="dropdownShowing"
              overlay-class-name="ant-dropdown-kline"
              :trigger="['click']"
              placement="bottomLeft"
            >
              <span :class="['text', { active: dropdownShowing }]">
                {{ kline_times[kline_resolution].title }}
                <i class="zicon-caret-down" />
              </span>
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="(time, key) in kline_times"
                  :key="key"
                  :class="{
                    'ant-dropdown-menu-item-selected': kline_resolution === key
                  }"
                  @click="changeKlineTime(key)"
                >
                  {{ time.title }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </cube-tab>

          <cube-tab
            v-else
            class="picker depth"
            :label="tab.label"
            :key="tab.label"
          >
            <i slot="icon" v-show="false"></i>
            <span class="text">{{ tab.text }}</span>
          </cube-tab>
        </template>
      </cube-tab-bar>
    </div>
    <div class="charts">
      <kline-chart
        :class="['kline-chart', { showing: selected === 'time-picker' }]"
        :market_id="market.id"
        :period="kline_period"
      />
      <depth-chart
        :class="['depth-chart', { showing: selected === 'depth' }]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Component, Prop, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "kline-chart": () => import("@/components/mobile/kline-chart"),
    "depth-chart": () => import("@/components/mobile/depth-chart")
  }
})
export default class GroupChart extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;

  tabs = [
    {
      label: "time-picker"
    },
    {
      label: "depth",
      text: "Depth"
    }
  ];

  dropdownShowing = false;
  selected = "time-picker";
  kline_resolution = localStorage.getItem("tradingview.resolution") || "15";
  kline_times = {
    "1": {
      title: "1m",
      value: 1
    },
    "5": {
      title: "5m",
      value: 5
    },
    "15": {
      title: "15m",
      value: 15
    },
    "30": {
      title: "30m",
      value: 30
    },
    "60": {
      title: "1H",
      value: 60
    },
    "120": {
      title: "2H",
      value: 120
    },
    "240": {
      title: "4H",
      value: 240
    },
    "360": {
      title: "6H",
      value: 360
    },
    "720": {
      title: "12H",
      value: 720
    },
    "1D": {
      title: "1D",
      value: 1440
    },
    "1W": {
      title: "1W",
      value: 10080
    }
  };

  get kline_period() {
    const resolution = this.kline_resolution;
    return this.kline_times[resolution].value;
  }

  beforeCreate() {
    if (!localStorage.getItem("tradingview.resolution"))
      localStorage.setItem("tradingview.resolution", "15");
  }

  changeKlineTime(resolution) {
    this.dropdownShowing = false;

    this.kline_resolution = resolution;
    localStorage.setItem("tradingview.resolution", resolution);
  }

  changeTypeChart(value) {
    this.selected = value;
  }
}
</script>
