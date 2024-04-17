<template>
  <z-card class="market-trades" :bordered="false" title="Market trades">
    <z-table
      :columns="COLUMN"
      :loading="loading"
      :data="TradeController.trades"
      :border="false"
    >
      <template slot="price" slot-scope="{ column, item }">
        <span
          :class="[
            'price',
            `text-${column.algin}`,
            getTrendType(item.taker_type)
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
  </z-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import * as helpers from "@/library/z-helpers";
import moment from "moment";

@Component
export default class MarketTrades extends Vue {
  @Prop() readonly loading!: boolean;

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

  get price_precision() {
    return helpers.pricePrecision();
  }

  get amount_precision() {
    return helpers.amountPrecision();
  }

  getTrendType(taker_type) {
    return helpers.trendType(taker_type);
  }

  getPrice(price: string) {
    return Number(price).toFixed(this.price_precision);
  }

  getAmount(amount: string) {
    return Number(amount).toFixed(this.amount_precision);
  }

  getDate(created_at: string | number) {
    if (typeof created_at == "number") {
      return moment.unix(created_at).format("hh:mm:ss")
    }

    return moment(created_at).format("hh:mm:ss")
  }
}
</script>

<style lang="less">
.pro {
  .market-trades {
    .z-table {
      &-row {
        padding-right: 11px;
        padding-left: 16px;
      }
    }
  }
}
</style>
