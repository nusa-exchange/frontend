<template>
  <z-card
    :bordered="false"
    class="orderbook"
  >
    <template slot="head">
      <div
        v-for="(item, key) in type_list"
        :key="key"
        :class="{ change_book: true, active: type === key }"
        @click="change_type(key)"
      >
        <img :src="item" />
      </div>
    </template>
    <div class="z-table z-table-hoverable">
      <div class="z-table-head">
        <span class="text-left">
          {{ $t("page.global.table.price") }} ({{ market.quote_unit.toUpperCase() }})
        </span>
        <span class="text-right">
          {{ $t("page.global.table.amount") }} ({{ market.base_unit.toUpperCase() }})
        </span>
        <span class="text-right">
          {{ $t("page.global.table.sum") }} ({{ market.quote_unit.toUpperCase() }})
        </span>
      </div>
      <div :class="['z-table-content', type + '-type']">
        <depth-book ref="depth-asks" side="asks" />
        <div class="ticker-book">
          <div class="now-price" :class="getLastTrend()">
            {{ Number(ticker.last).toFixed(market.price_precision) }}
            <em class="price_usd">≈ {{ getPrice_USD() }} USD</em>
            <span class="change">{{ getChange() }}</span>
          </div>
        </div>
        <depth-book ref="depth-bids" side="bids" />
      </div>
    </div>
  </z-card>
</template>

<script lang="ts">
import TradeController from "@/controllers/trade";
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@/library/z-helpers";
import book_asks_svg from "@/assets/img/book_asks.svg";
import book_avg_svg from "@/assets/img/book_avg.svg";
import book_bids_svg from "@/assets/img/book_bids.svg";

@Component({
  components: {
    "depth-book": () => import("./depth.vue")
  }
})
export default class App extends Vue {
  loading = false;
  type = "default";
  type_list = {
    asks: book_asks_svg,
    default: book_avg_svg,
    bids: book_bids_svg
  };

  $refs!: {
    [key: string]: any;
  };

  get orderbook() {
    return TradeController.orderbook;
  }

  get market() {
    return TradeController.market;
  }

  get ticker () {
    return TradeController.ticker;
  }

  getLastTrend() {
    return helpers.getMarketPriceChange() >= 0 ? "text-up" : "text-down";
  }

  getPrice_USD() {
    return helpers.getMarketLastUSD();
  }

  getChange() {
    return this.ticker.price_change_percent;
  }

  change_type(type) {
    this.type = type;
  }
}
</script>

<style lang="less">
.page-exchange .orderbook {
  .now-price {
    font-size: 18px;
    width: 100%;
    .price_usd {
      font-size: 14px;
      font-style: normal;
      color: var(--color-gray);
    }
  }

  .z-table {
    &-content {
      .depth {
        height: calc(50% - 20px);
        overflow-y: hidden;
        overflow-x: hidden;
      }

      > div {
        position: relative;
        width: 100%;
        left: 0;
        transition: height 0.5s;
      }

      &.bids-type {
        .asks {
          height: 0;
        }
        .bids {
          height: calc(100% - 40px);
        }
      }
      &.asks-type {
        .bids {
          height: 0;
        }
        .asks {
          height: calc(100% - 40px);
        }
      }
    }

    &-row {
      opacity: 1;
      padding: 0;
      overflow: hidden;

      span {
        &:first-child {
          padding-left: 16px;
        }
        &:last-child {
          padding-right: 16px;
        }
      }

      &:hover {
        border-color: var(--border-color) !important;
        background-color: transparent;
      }
    }
  }

  .asks {
    .depth-overlay-mask {
      bottom: 0;
    }
  }

  .asks .depth-row {
    &:hover {
      border-top: 1px solid;
    }
  }

  .bids .depth-row {
    &:hover {
      border-bottom: 1px solid;
    }
  }

  .depth-row-hover {
    background-color: var(--bg-downdown-color) !important;
  }

  .ch {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;
  }

  .change_book {
    border: 1px solid;
    position: relative;
    display: inline-block;
    border-radius: 3px;
    width: 24px;
    height: 24px;
    margin-right: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    border-color: var(--border-color);
    &:hover,
    &.active {
      border-color: var(--selected-border-color);
    }
  }
}

.ticker-book {
  height: 40px;
  padding: 0 16px;
  line-height: 38px;
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  border: 1px solid;
  border-right: none;
  border-left: none;
  border-color: var(--border-color);
  .change {
    float: right;
    font-size: 14px;
  }
}
</style>
