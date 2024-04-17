<template>
  <div class="head-bar">
    <div class="head">
      <div class="action">
        <a-icon type="left" @click="remove_panel" />
      </div>

      <div class="title">
        Spot
      </div>
    </div>
    <cube-tab-bar
      ref="tab-nav"
      v-model="selected_label"
      show-slider
      :use-transition="true"
      :data="TYPE_LABEL"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class OrdersScreenHeadBar extends Vue {
  selected_label = this.TYPE_LABEL[0].label;

  get TYPE_LABEL() {
    return [
      {
        key: "open_orders",
        label: "Open Orders"
      },
      {
        key: "orders_history",
        label: "Orders History"
      },
      {
        key: "trades_history",
        label: "Trades History"
      }
    ];
  }

  remove_panel() {
    this.$emit("remove");
  }
}
</script>
