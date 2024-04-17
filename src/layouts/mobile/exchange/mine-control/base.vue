<template>
  <div class="page-exchange-m">
    <div class="page-exchange-m-orders">
      <div class="page-exchange-m-orders-head">
        <div class="page-exchange-m-orders-head-title">Current Orders</div>
        <div
          class="page-exchange-m-orders-head-action"
          @click="open_orders_screen"
        >
          <a-icon type="profile" /> View Orders
        </div>
      </div>
      <mine-control-content :orders="open_orders.orders" />
    </div>

    <orders-screen ref="orders-screen" />
  </div>
</template>

<script lang="ts">
import { UserController } from "@/controllers";
import TradeController from "@/controllers/trade";
import ZSmartModel from "@/library/z-eventbus";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "mine-control-content": () => import("./content.vue"),
    "orders-screen": () => import("@/views/mobile/screens/orders")
  }
})
export default class MineControl extends Vue {
  @Prop() readonly market: ZTypes.Market;

  $refs!: {
    [key: string]: any;
  };

  get open_orders() {
    return TradeController.open_orders;
  }

  get orders_history() {
    return TradeController.orders_history;
  }

  get trades_history() {
    return TradeController.trades_history;
  }

  get authorized() {
    return UserController.state == "active";
  }

  mounted() {
    if (!this.authorized) return;

    this.getOrders();
  }

  getOrders() {
    ["open_orders", "orders_history", "trades_history"].forEach(
      async (type: "open_orders" | "orders_history" | "trades_history") => {
        this[type].clear();

        this[type].market = "All";
        await this[type].getData(1, 500);

        this[type].realtime = true;
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
    );
  }

  open_orders_screen() {
    if (this.authorized) {
      this.open_screen("orders");
    } else {
      ZSmartModel.emit("need-login");
    }
  }

  open_screen(screen: string) {
    this.$refs[`${screen}-screen`].create();
  }
}
</script>
