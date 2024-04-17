<template>
  <div class="assets-row" @click="$emit('click')">
    <div class="assets-row-head">
      <span class="assets-row-title">
        <div class="assets-row-logo">
          <div class="assets-row-logo-content">
            <img :src="currency.icon_url" />
          </div>
        </div>
        {{ currency.id.toUpperCase() }}
        <span class="assets-row-name"> {{ currency.name }}</span>
      </span>
      <span v-if="!actionDisabled" class="assets-row-action">
        <a-icon type="right" />
      </span>
    </div>
    <div class="assets-row-content text-left">
      <div class="assets-row-column">
        <div class="assets-row-title">Total</div>
        <div class="assets-row-value">{{ total.toFixed(precision) }}</div>
        <div class="assets-row-value-estimate">${{ total_usd }}</div>
      </div>
      <div class="assets-row-column text-left">
        <div class="assets-row-title">Available</div>
        <div class="assets-row-value">{{ available.toFixed(precision) }}</div>
        <div class="assets-row-value-estimate">${{ available_usd }}</div>
      </div>
      <div class="assets-row-column text-right">
        <div class="assets-row-title">In orders</div>
        <div class="assets-row-value">
          {{ locked.toFixed(precision) }}
        </div>
        <div class="assets-row-value-estimate">${{ locked_usd }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AssetsRow extends Vue {
  @Prop() readonly currency!: ZTypes.Currency;
  @Prop() readonly actionDisabled!: boolean;

  get assets() {
    return new helpers.Balance(this.currency.id);
  }

  get precision() {
    return this.currency.precision;
  }

  get locked() {
    return this.assets.locked;
  }

  get available() {
    return this.assets.available;
  }

  get total() {
    return this.assets.total;
  }

  get available_usd() {
    return this.assets.getAvailableUSD().toFixed(2);
  }

  get locked_usd() {
    return this.assets.getLockedUSD().toFixed(2);
  }

  get total_usd() {
    return this.assets.getTotalUSD().toFixed(2);
  }
}
</script>

<style lang="less">
.assets-row {
  padding: 8px;
  border-radius: 4px;
  background-color: var(--bg-card-color);

  &-logo {
    vertical-align: middle;
    text-align: center;
    display: table-cell;
    margin-right: 4px;

    &-content {
      height: 24px;
      width: 24px;
      background-color: var(--border-color);
      border-radius: 24px;
      vertical-align: middle;
      text-align: center;
      display: table-cell;

      img {
        height: 16px;
        width: 16px;
        display: block;
        margin: 0 auto;
      }
    }
  }

  &-title {
    font-weight: 500;
    font-size: 9px;
    color: var(--color-gray);
  }

  &-head {
    display: flex;
    justify-content: space-between;
    align-content: center;
    line-height: 24px;
  }

  &-head &-title {
    font-size: 14px;
    color: inherit;
    display: flex;

    .assets-row-name {
      margin-left: 4px;
    }
  }

  &-head &-action {
    color: var(--color-gray);
  }

  &-title &-name {
    font-size: 9px;
    color: var(--color-gray);
  }

  &-content {
    display: flex;
    margin-top: 4px;
  }

  &-column {
    flex: 1;
  }

  &-value {
    font-size: 10px;

    &-estimate {
      font-weight: 500;
      font-size: 8px;
      color: var(--color-gray);
    }
  }
}
</style>
