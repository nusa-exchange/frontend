<template>
  <div class="open-orders orders-screen-table">
    <div class="orders-screen-table-head">
      <div class="orders-screen-table-type-select">
        All Open Orders
        <i class="zicon-caret-down" />
      </div>
      <div class="orders-screen-table-action">
        <button @click="cancel_all_orders">Cancell All</button>
      </div>
    </div>
    <div class="orders-screen-table-container">
      <div class="orders-screen-table-content">
        <z-pull
          ref="pull"
          :loading="loading"
          :data="orders"
          :pull-down-refresh="true"
          :pull-up-refresh="true"
          :no-more="noMore"
          @pulling-down="onPullingDown"
          @pulling-up="onPullingUp"
        >
          <order-row
            v-for="(order, index) in orders"
            :key="index"
            :order="order"
          />
        </z-pull>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "order-row": () => import("@/components/mobile/order-row"),
    "z-pull": () => import("@/components/mobile/z-pull")
  }
})
export default class OrdersScreenOpenOrdersTable extends Vue {
  loading = false;
  page = 0;
  pageSize = 15;
  noMore = false;
  orders = [];
  type = "All";

  async mounted() {
    this.orders = await this.fetch_orders(1, 15);
    this.noMore = this.orders.length < 15;
    (this.$refs["pull"] as any).forceUpdate(true, this.noMore);
  }

  async fetch_orders(
    page = this.page,
    pageSize = this.pageSize
  ): Promise<ZTypes.Order[]> {
    this.loading = true;
    try {
      const { data } = await this.TradeController.get_orders({
        market: null,
        state: "wait",
        page: page,
        limit: pageSize
      });

      this.page = page;
      this.pageSize = pageSize;

      return data;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  async onPullingDown(forceUpdate: (dirty: boolean, nomore: boolean) => void) {
    const orders = await this.fetch_orders(1, 15);
    this.orders = orders;

    this.noMore = orders.length < this.pageSize;
    forceUpdate(true, this.noMore);
  }

  async onPullingUp(forceUpdate: (dirty: boolean, nomore: boolean) => void) {
    const orders = await this.fetch_orders(this.page + 1, 15);
    this.orders = [...this.orders, ...orders];

    this.noMore = orders.length < this.pageSize;
    forceUpdate(!!orders.length, this.noMore);
  }

  cancel_all_orders() {
    return;
  }
}
</script>

<style lang="less">
.open-orders.orders-screen-table-content {
  height: calc(100% - 25px);
}
</style>
