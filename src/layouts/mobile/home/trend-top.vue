<template>
  <div class="trend-top">
    <cube-tab-bar
      class="trend-top-action-group"
      ref="tab-nav"
      v-model="selectedLabel"
      show-slider
      :use-transition="false"
    >
      <cube-tab
        class="trend-top-action"
        :class="[item.label === 'gainers' ? 'text-left' : 'text-right']"
        v-for="item in tabs"
        :label="item.label"
        :key="item.label"
      >
        <span>{{ item.text }}</span>
      </cube-tab>
      <span
        class="trend-top-action more text-right"
        @click="$router.push('/m/markets')"
      >
        More >>
      </span>
    </cube-tab-bar>

    <div class="z-table z-table-no-scroll">
      <div class="z-table-head">
        <span class="text-left">Pair</span>
        <span class="text-right">Price</span>
        <span class="text-right">(24h)Change</span>
      </div>
      <cube-slide
        ref="slide"
        :allow-vertical="true"
        :loop="false"
        :initial-index="initialIndex"
        :auto-play="false"
        :show-dots="false"
        :options="{
          listenScroll: true,
          probeType: 3,
          directionLockThreshold: 0
        }"
        @change="changePage"
      >
        <cube-slide-item
          v-for="item in tabs"
          :key="item.label"
          :label="item.label"
        >
          <div class="z-table-content">
            <market-row
              v-for="market in findTopMarkets(item.label === 'gainers')"
              :key="market.id"
              :market_id="market.id"
              @click="$emit('click', market)"
            />
          </div>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "market-row": () => import("@/components/mobile/market-row")
  }
})
export default class TrendTop extends Mixins(MarketMixin) {
  $refs!: {
    [key: string]: any;
  };

  selectedLabel = "gainers";

  tabs = [
    {
      label: "gainers",
      text: "Top Gainers"
    },
    {
      label: "losers",
      text: "Top Losers"
    }
  ];

  get initialIndex() {
    const index = this.tabs.findIndex(
      tab => tab.label.toLowerCase() === this.selectedLabel.toLowerCase()
    );
    return index;
  }

  findTopMarkets(isGainers: boolean) {
    let tickers = this.findTickers("market", "All");

    tickers = tickers.sort(
      (low, high) =>
        this.percentToNumber(low.price_change_percent) -
        this.percentToNumber(high.price_change_percent)
    );

    if (isGainers) tickers = tickers.reverse();
    return tickers.slice(0, 10);
  }

  changePage(index) {
    this.selectedLabel = this.tabs[index].label;
  }
}
</script>

<style lang="less">
@tab-bar-height: 50px;
@head-bar-height: 35px;

.trend-top {
  height: calc(100vh - @tab-bar-height - @head-bar-height);
  background-color: var(--bg-card-color);

  &-action {
    position: relative;
    display: inline-block;
    width: 100% / 3;
    font-size: 12px;
    font-weight: 500;
    line-height: 25px;
    color: var(--color-gray);

    &-group {
      display: block;
      height: 25px;
      line-height: 25px;
      padding: 0 16px;

      .cube-tab-bar-slider {
        display: none;
      }

      .cube-tab_active {
        color: var(--blue-color);
      }

      .cube-tab {
        width: 100% / 3;
        padding: 0;
      }
    }

    &.more {
      font-size: 9px;
      color: var(--color-gray);
    }
  }

  .z-table {
    height: calc(100vh - 50px - 35px - 25px - 20px);
    min-height: auto;
    padding-bottom: 0;

    &-head {
      height: 20px;
      line-height: 20px;
      padding: 0 16px;
    }

    .cube-slide {
      height: calc(100% - 20px);
    }

    &-content {
      height: 100%;
    }

    &-row {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
}
</style>
