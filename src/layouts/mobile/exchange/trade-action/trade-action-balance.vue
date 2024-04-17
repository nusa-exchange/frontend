<template>
  <div class="trade-action-balance">
    <div class="trade-action-balance-row">
      <span class="trade-action-balance-title">
        Available {{ currency_id.toUpperCase() }}
      </span>
      <span class="trade-action-balance-value">
        {{ assets.available || "--" }}
      </span>
    </div>
    <div class="trade-action-balance-row">
      <span class="trade-action-balance-title">
        Locked {{ currency_id.toUpperCase() }}
      </span>
      <span class="trade-action-balance-value">
        {{ assets.locked || "--" }}
      </span>
    </div>
    <div class="trade-action-balance-row">
      <span class="trade-action-balance-title">
        Total {{ currency_id.toUpperCase() }}
      </span>
      <span class="trade-action-balance-value">{{ assets.total || "--" }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TradeActionBalance extends Vue {
  @Prop() readonly currency_id!: string;

  get assets() {
    return new helpers.Balance(this.currency_id);
  }
}
</script>
