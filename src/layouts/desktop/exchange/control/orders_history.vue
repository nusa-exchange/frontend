<template>
  <z-table
    :columns="COLUMN"
    :loading="mine_control.loading"
    :data="mine_control.orders"
    :hover="false"
    :border="false"
  >
    <template slot="created_at" slot-scope="{ item, column }">
      <span :class="['created_at', `text-${column.algin}`]">
        {{ getDate(item.created_at) }}
      </span>
    </template>
    <template slot="side" slot-scope="{ item, column }">
      <span :class="['side', `text-${column.algin}`, getTrend(item.side)]">
        {{ item.side }}
      </span>
    </template>
    <template slot="price" slot-scope="{ item, column }">
      <span :class="['price', `text-${column.algin}`]">
        {{ getPrice(item.price) }}
      </span>
    </template>
    <template slot="amount" slot-scope="{ item, column }">
      <span :class="['amount', `text-${column.algin}`]">
        {{ getAmount(item.origin_volume) }}
      </span>
    </template>
    <template slot="filled" slot-scope="{ item, column }">
      <span :class="['filled', `text-${column.algin}`]">
        {{
          (100 - (item.remaining_volume / item.origin_volume) * 100).toFixed(2)
        }}
      </span>
    </template>
    <template slot="total" slot-scope="{ item, column }">
      <span :class="['total', `text-${column.algin}`]">
        {{ getTotal(item.price * item.origin_volume) }}
      </span>
    </template>
    <template slot="action" slot-scope="{ item, column }">
      <span :class="['action', `text-${column.algin}`]">
        <i
          v-if="item.state === 'wait'"
          class="zicon-close"
          @click="TradeController.stop_order(item.uuid)"
        />
      </span>
    </template>
  </z-table>
</template>

<script>
import TradeController from "@/controllers/trade";
import { Component, Mixins } from "vue-property-decorator";
import MineControlMixin from "./mixin";

@Component
export default class OrdersHistory extends Mixins(MineControlMixin) {
  name = "orders_history";

  get COLUMN() {
    return [
      {
        title: this.$t("page.global.table.date"),
        key: "created_at",
        algin: "left",
        scopedSlots: true,
      },
      { title: this.$t("page.global.table.type"), key: "ord_type", algin: "left" },
      {
        title: this.$t("page.global.table.side"),
        key: "side",
        algin: "left",
        scopedSlots: true,
      },
      {
        title: this.$t("page.global.table.price"),
        key: "price",
        algin: "center",
        scopedSlots: true,
      },
      {
        title: `${this.$t("page.global.table.amount")} (${this.isAsk})`,
        key: "amount",
        algin: "right",
        scopedSlots: true,
      },
      {
        title: this.$t("page.global.table.filled"),
        key: "filled",
        algin: "right",
        scopedSlots: true,
      },
      {
        title: `${this.$t("page.global.table.total")} (${this.isBid})`,
        key: "total",
        algin: "right",
        scopedSlots: true,
      },
      { title: ``, key: "action", algin: "right", scopedSlots: true },
    ];
  }

  get TradeController() {
    return TradeController;
  }

  get orders_data() {
    const orders = this.mine_control.orders;

    return orders.map((order) => {
      order.created_at = this.getDate(order.created_at);

      return order;
    });
  }
}
</script>
