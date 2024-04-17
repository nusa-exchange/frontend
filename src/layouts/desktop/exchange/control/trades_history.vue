<template>
  <z-table
    :columns="COLUMN"
    :loading="mine_control.loading"
    :data="mine_control.trades"
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
        {{ getAmount(item.amount) }}
      </span>
    </template>
    <template slot="total" slot-scope="{ item, column }">
      <span :class="['total', `text-${column.algin}`]">
        {{ getTotal(item.price * item.amount) }}
      </span>
    </template>
  </z-table>
</template>

<script>
import { Component, Mixins } from "vue-property-decorator";
import MineControlMixin from "./mixin";

@Component
export default class TradesHistory extends Mixins(MineControlMixin) {
  name = "trades_history";

  get COLUMN() {
    return [
      {
        title: this.$t("page.global.table.date"),
        key: "created_at",
        algin: "left",
        scopedSlots: true
      },
      {
        title: this.$t("page.global.table.side"),
        key: "side",
        algin: "left",
        scopedSlots: true,
      },
      { title: "Price", key: "price", algin: "center", scopedSlots: true },
      {
        title: `${this.$t("page.global.table.amount")} (${this.isAsk})`,
        key: "amount",
        algin: "right",
        scopedSlots: true,
      },
      {
        title: `${this.$t("page.global.table.total")} (${this.isBid})`,
        key: "total",
        algin: "right",
        scopedSlots: true
      },
    ];
  }

  get trades_data() {
    const orders = this.mine_control.trades;

    return orders.map((order) => {
      order.created_at = this.getDate(order.created_at);

      return order;
    });
  }
}
</script>
