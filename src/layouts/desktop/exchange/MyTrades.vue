<template>
  <z-card class="my-trades">
    <z-table
      :columns="COLUMN"
      :data="trades"
      :border="false"
    >
      <template slot="price" slot-scope="{ column, item }">
        <span
          :class="[
            'price',
            `text-${column.algin}`,
            getTrend(item.taker_type)
          ]"
        >
          {{ getPrice(item.price) }}
        </span>
      </template>
      <template slot="amount" slot-scope="{ column, item }">
        <span :class="['amount', `text-${column.algin}`]">
          {{ getAmount(item.amount) }}
        </span>
      </template>
      <template slot="created_at" slot-scope="{ column, item }">
        <span :class="['time', `text-${column.algin}`]">
          {{ getDate(item.created_at) }}
        </span>
      </template>
    </z-table>
    <modal-exchange v-if="!UserController.isAuth" />
  </z-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import MineControlMixin from './control/mixin';

@Component({
  components: {
    "modal-exchange": () => import("@/components/desktop/exchange/_modal.vue")
  }
})
export default class MyTrades extends Mixins(MineControlMixin) {
  get market() {
    return this.TradeController.market;
  }
  get COLUMN() {
    return [
      {
        title: `${this.$t("page.global.table.price")} (${this.market.quote_unit.toUpperCase()})`,
        key: "price",
        algin: "left",
        scopedSlots: true
      },
      {
        title: `${this.$t("page.global.table.amount")} (${this.market.base_unit.toUpperCase()})`,
        key: "amount",
        algin: "right",
        scopedSlots: true
      },
      {
        title: this.$t("page.global.table.time"),
        key: "created_at",
        class_name: "time",
        algin: "right",
        scopedSlots: true
      }
    ];
  }

  get trades() {
    return [...this.TradeController.trades_history.trades].slice(0, 100);
  }

  getDate(created_at) {
    const date = new Date(created_at);
    return (
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2) +
      ":" +
      ("00" + date.getSeconds()).slice(-2)
    );
  }
}
</script>

<style lang="scss">

</style>
