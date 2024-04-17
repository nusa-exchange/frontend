<template>
  <fragment v-if="is_wait">
    <div :class="['order-row', `order-row-${order.side}`, 'order-row-wait']">
      <circle-filled :filled="filled_percent" :side="order.side" />
      <div class="order-row-content">
        <div class="order-row-line">
          <div class="market-name">{{ market.name }}</div>
          <div class="created_at">{{ getDate(order.created_at, true) }}</div>
        </div>
        <div class="order-row-line">
          <div class="order-price-volume">
            <span>
              <div class="title">Volume</div>
              <div class="title">Price</div>
            </span>
            <span>
              <div class="value">
                <span
                  class="executed"
                  v-text="filled ? getAmount(filled) : '--'"
                />
                <span
                  class="origin"
                  style="color: var(--color-gray);"
                  v-text="'/ ' + getAmount(order.origin_volume)"
                />
              </div>
              <div class="value">{{ getPrice(order.price) }}</div>
            </span>
          </div>

          <button @click="cancel_order" class="order-row-action">Cancel</button>
        </div>
      </div>
    </div>
  </fragment>
  <fragment v-else>
    <div
      :class="[
        'order-row',
        `order-row-${order.side}`,
        `order-row-${order.state}`
      ]"
    >
      <div class="order-row-content">
        <div class="order-row-line">
          <div class="market-name">{{ market.name }}</div>
          <div class="created_at">{{ getDate(order.created_at, true) }}</div>
        </div>
        <div class="order-row-line">
          <div :class="['order-type', trendType(order.side)]">
            {{ $t(`market.orders.ord_type.${order.ord_type}`) }}
          </div>
          <div :class="['order-state', `order-state-${order.state}`]">
            {{ $t(`market.orders.state.${order.state}`) }}
          </div>
        </div>

        <div class="order-row-line order-price-volume">
          <span>
            <div class="title">Volume</div>
            <div class="title">Price</div>
          </span>
          <span>
            <div class="value">
              <span
                class="executed"
                v-text="filled ? getAmount(filled) : '--'"
              />
              <span
                class="origin"
                style="color: var(--color-gray);"
                v-text="'/' + getAmount(order.origin_volume)"
              />
            </div>
            <div class="value">{{ getPrice(order.price) }}</div>
          </span>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script lang="ts">
import { TradeController } from "@/controllers";
import { MarketMixin } from "@/mixins/mobile";
import { Component, Prop, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "circle-filled": () => import("./circle-filled.vue")
  }
})
export default class OrderRow extends Mixins(MarketMixin) {
  @Prop() readonly order: ZTypes.Order;

  get market_id() {
    return this.order.market;
  }

  get filled() {
    return (
      Number(this.order.origin_volume) - Number(this.order.remaining_volume)
    );
  }

  get is_wait() {
    return this.order.state == "wait";
  }

  get filled_percent() {
    const { executed_volume, origin_volume } = this.order;

    return (
      (Number(executed_volume) / Number(origin_volume)) *
      100
    ).toFixedNumber(2);
  }

  cancel_order() {
    TradeController.stop_order(this.order.uuid);
  }
}
</script>

<style lang="less">
.order-row {
  position: relative;
  display: block;
  width: 100%;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;

  &:last-child {
    border-bottom: none;
  }

  &-line {
    position: relative;
    display: flex;
    width: 100%;
    justify-content: space-between;

    > * {
      display: inline-block;
      &:last-child {
        text-align: right;
      }
    }
  }

  .title {
    color: var(--color-gray);
    font-size: 9px;
    font-weight: normal;
  }

  .created_at {
    font-size: 8px;
    color: var(--color-gray);
    font-weight: normal;
  }

  .order-type {
    font-size: 10px;
    margin-bottom: 4px;
    line-height: 1;
  }

  .order-state {
    color: var(--color-gray);
    font-size: 8px;
    background-color: var(--bg-card-head-color);
    border-radius: 2px;
    height: 14px;
    line-height: 14px;
    padding: 0 4px;
  }

  .order-price-volume {
    display: flex;
    line-height: 14px;
    width: 100%;
    font-size: 9px;
    margin-top: 4px;

    > span {
      flex: 1;

      &:last-child {
        text-align: right;
      }
    }
  }

  .order-row-circle-filled {
    position: relative;
    display: inline-block;
    margin-right: 12px;
    text-align: center;

    &.buy, &.buy .ant-progress-text {
      color: var(--up-color);
    }

    &.sell, &.sell .ant-progress-text {
      color: var(--down-color);
    }

    .type-side {
      font-size: 8px;
      margin-bottom: 4px;
    }

    .ant-progress-circle-trail {
      stroke: var(--border-color) !important;
    }

    .ant-progress-text {
      font-size: 7px;
    }
  }

  &-action {
    position: absolute;
    bottom: 0;
    right: 0;

    background-color: var(--border-color);
    border-radius: 2px;
    font-size: 8px;
    height: 16px;
    padding: 0 8px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: var(--disabled-color);
    }
  }

  &-buy {
    .ant-progress-circle-path {
      stroke: var(--up-color) !important;
    }
  }

  &-sell {
    .ant-progress-circle-path {
      stroke: var(--down-color) !important;
    }
  }

  &-wait {
    display: flex;

    .order-price-volume {
      .title {
        width: 50px;
      }

      > span {
        flex: none;
        text-align: left !important;
      }
    }

    .order-price-volume span {
      margin-right: 4px !important;
    }
  }

  &-wait &-content {
    width: 100%;
  }
}
</style>
