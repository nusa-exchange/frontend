<template>
  <z-card
    v-model="type_control"
    :tab-list="tab_list"
    class="page-trade-mine-control"
  >
    <div slot="head" class="extra-action cancel-all">
      <a-button v-if="type_control == 'open_orders'" @click="cancel_all_orders" type="primary">
        {{ $t("page.global.action.cancel_all") }}
      </a-button>
    </div>
    <open-orders
      v-show="type_control === 'open_orders'"
      :type_control="type_control"
    />
    <orders-history
      v-show="type_control === 'orders_history'"
      :type_control="type_control"
    />
    <trades-history
      v-show="type_control === 'trades_history'"
      :type_control="type_control"
    />
    <modal-exchange v-if="!UserController.isAuth" />
  </z-card>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "open-orders": () => import("./control/open_orders.vue"),
    "orders-history": () => import("./control/orders_history.vue"),
    "trades-history": () => import("./control/trades_history.vue"),
    "modal-exchange": () => import("@/components/desktop/exchange/_modal.vue")
  }
})
export default class MineControl extends Vue {
  type_control = "open_orders";

  get tab_list() {
    return [
      {
        key: "open_orders",
        text: this.$t("page.global.header.orders.open_orders")
      },
      {
        key: "orders_history",
        text: this.$t("page.global.header.orders.orders_history")
      },
      {
        key: "trades_history",
        text: this.$t("page.global.header.orders.trades_history")
      }
    ];
  }

  get market() {
    return this.TradeController.market;
  }

  public mounted() {
    if (this.UserController.isAuth) {
      this.getData();
    }
  }

  public getData() {
    ["open_orders", "orders_history", "trades_history"].forEach(
      async (type: "open_orders" | "orders_history" | "trades_history") => {
        const mine_control = this.TradeController[type];
        mine_control.market = this.market.id;

        mine_control.market = this.market.id;
        mine_control.clear();
        await mine_control.getData();

        mine_control.realtime = true;
      }
    );
  }

  public cancel_all_orders() {
    this.TradeController.stop_orders(this.market.id);
  }

  public translation(message, data = {}) {
    return helpers.translation("page.exchange." + message, data);
  }
}
</script>

<style lang="less">
.page-trade-mine-control {
  .z-table {
    &-row {
      line-height: 20px;
    }
  }
}
</style>
