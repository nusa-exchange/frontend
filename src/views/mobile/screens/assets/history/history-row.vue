<template>
  <div class="assets-history-row" @click="$emit('click')">
    <p class="assets-history-row-line">
      <span class="currency-id">{{ record.currency.toUpperCase() }}</span>
      <span class="amount">{{ record.amount }}</span>
    </p>
    <p class="assets-history-row-line">
      <span class="date">{{ created_at }}</span>
      <span class="state">
        <span :class="['dot', class_state]"></span>
        <span>{{ $t(`page.assets.history.state.${record.state}`) }}</span>
      </span>
    </p>
  </div>
</template>

<script lang="ts">
import { getDate } from "@/library/z-helpers";
import { assets_state_color } from "@/mixins";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AssetsHistoryRow extends Vue {
  @Prop() readonly record!: ZTypes.Deposit | ZTypes.Withdraw;

  get created_at() {
    return getDate(this.record.created_at, true);
  }

  get class_state() {
    return assets_state_color(this.record.state);
  }
}
</script>

<style lang="less">
.assets-history-row {
  padding: 4px 0;

  &-line {
    display: flex;
    justify-content: space-between;
  }

  .currency-id,
  .amount {
    font-size: 10px;
  }

  .amount {
    font-weight: 500;
  }

  .date,
  .state {
    font-size: 8px;
  }

  .date {
    color: var(--color-gray);
  }

  .state {
    position: relative;
    color: var(--color-gray);

    .dot {
      position: absolute;
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background-color: var(--color-gray);
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
