<template>
  <div :class="['trade-action', side]">
    <div class="trade-action-side">
      <span
        v-for="(_side, index) in SIDE"
        :key="index"
        @click="change_side(_side)"
        :class="{
          [`bg-${_side === 'buy' ? 'up' : 'down'}`]: side === _side,
          [`text-${_side === 'buy' ? 'up' : 'down'}`]: side !== _side
        }"
      >
        {{ _side === "buy" ? "Buy" : "Sell" }}
      </span>
    </div>
    <div class="trade-action-type-picker" @click="show_type_picker">
      <span class="trade-action-type-picker-value">
        {{ ord_type === "limit" ? "Limit Order" : "Market Order" }}
        <a-icon class="trade-action-type-picker-icon" type="caret-down" />
      </span>
    </div>
    <trade-action-part :ord_type="ord_type" :side="side" />
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Picker } from "cube-ui";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "trade-action-part": () => import("./trade-action-part.vue")
  }
})
export default class TradeAction extends Vue {
  picker!: Picker;
  side: ZTypes.OrderSide = "buy";

  SIDE = ["buy", "sell"];
  
  ord_type_selected = "limit";

  get ORDER_TYPES() {
    return [
      {
        value: "limit",
        text: this.translation("limit_order")
      },
      {
        value: "market",
        text: this.translation("market_order")
      },
      {
        value: "stop_limit_order",
        text: this.translation("stop_limit_order")
      }
    ]
  }

  get ord_type() {
    if (this.ord_type_selected == "market") {
      return this.ord_type_selected;
    }

    return "limit"
  }

  translation(message, data = {}) {
    return helpers.translation("page.exchange.trade_action." + message, data)
  }

  mounted() {
    const side_by_route = this.$route.query.type;

    if (side_by_route) {
      this.side = side_by_route as ZTypes.OrderSide;
    }
  }

  change_side(side) {
    if (this.side === side) return;

    this.side = side;
    this.$router.push(`/m/exchange?type=${side}`);
  }

  show_type_picker() {
    if (!this.picker) {
      this.picker = this.$createPicker({
        title: "Order Type",
        data: [this.ORDER_TYPES],
        onSelect: this.change_ord_type,
        cancelTxt: "Cancel",
        confirmTxt: "Confirm"
      });
    }
    this.picker.show();
  }

  change_ord_type(ordType) {
    this.ord_type_selected = ordType;
  }
}
</script>

<style lang="less">
@trade-action-input-height: 25px;

.trade-action {
  padding-right: 4px;

  &-side {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      flex: 1;
      height: 25px;
      line-height: 25px;
      margin: 0 4px;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      border-radius: 2px;
      color: var(--bg-color);
      background-color: var(--bg-card-color);

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &-type-picker {
    position: relative;
    font-size: 12px;
    font-weight: 500;
    margin: 6px 0;
    color: var(--color-gray);

    &-value {
      position: relative;
    }

    &-icon {
      position: absolute;
      right: -10px;
      bottom: 0px;
      font-weight: 500;
      transform: rotate(-45deg);
      font-size: 7px;
    }
  }

  &-input {
    position: relative;
    height: @trade-action-input-height;
    line-height: @trade-action-input-height;

    &-action {
      position: absolute;
      height: 100%;
      top: 0;
      width: @trade-action-input-height;
      text-align: center;
      background-color: var(--bg-card-head-color);
      color: var(--color-gray);
      font-size: 14px;

      &.minus {
        left: 0;
        border-radius: 2px 0px 0px 2px;
      }

      &.plus {
        right: 0;
        border-radius: 0px 2px 2px 0px;
      }
    }

    input {
      width: 100%;
      height: @trade-action-input-height;
      line-height: @trade-action-input-height;
      text-align: center;
      background-color: var(--bg-card-color);
      border-radius: 2px;
    }
  }

  &-estimate {
    color: var(--color-gray);
    font-size: 8px;
    margin: 2px 0;
  }

  &-balance {
    &-row {
      position: relative;
      font-size: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;

      &-title {
        color: var(--color-gray);
      }

      &:nth-child(2) {
        margin-bottom: 6px;

        &:after {
          content: "";
          height: 1px;
          width: 100%;
          position: absolute;
          bottom: -4px;
          left: 0;
          background-color: var(--border-color);
        }
      }
    }
  }

  &-amount-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;

    span {
      flex: 1;
      text-align: center;
      font-size: 8px;
      margin: 0 4px;
      border: 1px solid var(--border-color);
      border-radius: 2px;
      padding: 1px 0;

      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }

  &-calculate-total {
    color: var(--color-gray);
    margin-top: 4px;

    &-value {
      color: var(--text-default-color);
    }
  }

  &-calculate-fee {
    color: var(--color-gray);
    margin-top: 4px;

    &-value {
      color: var(--text-default-color);
    }
  }

  &-button {
    margin: 10px 0;
    height: 25px;
    line-height: 25px;
    border-radius: 2px;
    width: 100%;
    text-align: center;
    font-weight: 500;

    &-disabled {
      cursor: not-allowed;
    }
  }

  &.buy &-button {
    background-color: var(--up-color);
  }

  &.sell &-button {
    background-color: var(--down-color);
  }
}
</style>
