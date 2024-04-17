<template>
  <div class="trade-row">
    <div class="trade-row-line">
      <div class="market-name">{{ market.name }}</div>
      <div class="created_at">{{ getDate(trade.created_at, true) }}</div>
    </div>
    <div class="trade-row-line">
      <div :class="['type', trendType(trade.side)]">
        {{ $t(`market.side.${trade.side}`) }}
      </div>
    </div>
    <div class="order-row-line order-price-volume">
      <span>
        <div class="title">Price({{ market.quote_unit.toUpperCase() }})</div>
        <div class="title">Filled({{ market.base_unit.toUpperCase() }})</div>
        <div class="title">Fee({{ trade.fee_currency.toUpperCase() }})</div>
        <div class="title">Total({{ market.quote_unit.toUpperCase() }})</div>
      </span>
      <span>
        <div class="value">
          {{ getPrice(trade.price) }}
        </div>
        <div class="value">{{ getAmount(trade.amount) }}</div>
        <div class="value">{{ getAmount(trade.fee_amount) }}</div>
        <div class="value">{{ getAmount(trade.total) }}</div>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins, Prop } from "vue-property-decorator";

@Component
export default class TradeRow extends Mixins(MarketMixin) {
  @Prop() readonly trade!: ZTypes.Trade;

  get market_id() {
    return this.trade.market;
  }
}
</script>

<style lang="less">
.trade-row {
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
    font-size: 10px;
    font-weight: normal;
  }

  .created_at {
    font-size: 8px;
    color: var(--color-gray);
    font-weight: normal;
  }

  .type {
    font-size: 10px;
    margin-bottom: 4px;
    line-height: 1;
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
}
</style>
