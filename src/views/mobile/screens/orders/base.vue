<template>
  <panel-view class="orders-screen">
    <head-bar ref="head-bar" @remove="destroy" />
    <body-bar />
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "head-bar": () => import("@/layouts/mobile/screens/orders/head-bar.vue"),
    "body-bar": () => import("@/layouts/mobile/screens/orders/body-bar.vue")
  }
})
export default class OrdersScreen extends Mixins(ScreenMixin) {
}
</script>

<style lang="less">
.orders-screen {
  .head-bar {
    .head {
      height: 35px;
      line-height: 35px;
      position: relative;
    }

    .title {
      text-align: center;
      font-size: 14px;
    }

    .action {
      position: absolute;
      left: 8px;
      font-size: 14px;
      color: var(--color-gray);
    }
  }

  .cube-slide-item {
    padding: 0 8px;
    background-color: var(--bg-card-color);
  }

  &-table {
    position: relative;
    height: 100%;

    &-head {
      display: flex;
      height: 32px;
      padding: 8px 0;
      justify-content: space-between;
    }

    &-container {
      position: relative;
      height: 100%;
      width: 100%;
    }

    &-content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }

    &-type-select {
      color: var(--color-gray);
      font-size: 10px;
      i {
        margin-left: 4px;
        font-size: 6px;
      }
    }

    &-action {
      button {
        background-color: var(--border-color);
        border-radius: 2px;
        font-size: 8px;
        height: 16px;
      }
    }
  }
}
</style>
