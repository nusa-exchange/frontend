<template>
  <div class="page-trade-m orderbook">
    <div class="z-table">
      <div class="z-table-head">
        <span class="price text-left">
          <span>Price({{ is_ask }})</span>
        </span>
        <span class="amount text-right">
          <span>Amount({{ is_bid }})</span>
        </span>
      </div>
      <div class="z-table-content">
        <depth side="asks" />
        <ticker-status />
        <depth side="bids" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TradeController } from "@/controllers";
import * as helpers from "@/library/z-helpers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    depth: () => import("./depth.vue"),
    "ticker-status": () => import("./ticker-status.vue")
  }
})
export default class Orderbook extends Vue {
  get is_ask() {
    return TradeController.market.base_unit.toUpperCase();
  }

  get is_bid() {
    return TradeController.market.quote_unit.toUpperCase();
  }
}
</script>

<style lang="less">
@ticker-status-height: 27px + 8px;

.page-trade-m.orderbook {
  position: relative;
  .depth {
    position: relative;
    height: calc(50% - (@ticker-status-height / 2));

    .z-table-row {
      background-position: 0;
      background-size: 0 0;
      background-repeat: no-repeat;
    }

    &-asks .z-table-row {
      background-image: linear-gradient(
        var(--down-bg-color),
        var(--down-bg-color)
      );
    }

    &-bids .z-table-row {
      background-image: linear-gradient(
        rgba(46, 228, 178, 0.25),
        rgba(46, 228, 178, 0.25)
      );
    }
  }

  .z-table {
    font-weight: 500;

    &-head {
      padding: 0 4px;
      height: 18px;
      line-height: 18px;
      font-size: 8px;
    }

    &-content {
      height: calc(100% - 18px);
    }

    &-row {
      padding: 0 4px;
      height: 18px;
      line-height: 18px;
    }
  }
}
</style>
