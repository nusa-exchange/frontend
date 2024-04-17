<template>
  <div class="orders-screen-table">
    <div class="orders-screen-table-content">
      <z-pull
        ref="pull"
        :loading="loading"
        :data="trades"
        :pull-down-refresh="true"
        :pull-up-refresh="true"
        :no-more="noMore"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp"
      >
        <trade-row
          v-for="(trade, index) in trades"
          :key="index"
          :trade="trade"
        />
      </z-pull>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "trade-row": () => import("@/components/mobile/trade-row"),
    "z-pull": () => import("@/components/mobile/z-pull")
  }
})
export default class OrdersScreenOpenOrdersTable extends Vue {
  loading = false;
  page = 0;
  pageSize = 15;
  noMore = false;
  trades = [];
  type = "All";

  async mounted() {
    this.trades = await this.fetch_trades(1, 15);
    this.noMore = this.trades.length < 15;
    (this.$refs["pull"] as any).forceUpdate(true, this.noMore);
  }

  async fetch_trades(
    page = this.page,
    pageSize = this.pageSize
  ): Promise<ZTypes.Order[]> {
    this.loading = true;
    try {
      const { data } = await this.TradeController.get_trades({
        market: null,
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
    const trades = await this.fetch_trades(1, 15);
    this.trades = trades;

    this.noMore = trades.length < this.pageSize;
    forceUpdate(true, this.noMore);
  }

  async onPullingUp(forceUpdate: (dirty: boolean, nomore: boolean) => void) {
    const trades = await this.fetch_trades(this.page + 1, 15);
    this.trades = [...this.trades, ...trades];

    this.noMore = trades.length < this.pageSize;
    forceUpdate(!!trades.length, this.noMore);
  }
}
</script>
