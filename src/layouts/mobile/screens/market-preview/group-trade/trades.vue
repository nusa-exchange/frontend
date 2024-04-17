<template>
  <div class="trades">
    <z-table :columns="COLUMN" :data="trades" :scroll="false">
      <template slot="price" slot-scope="{ column, item }">
        <span
          :class="['price', `text-${column.algin}`, trendType(item.taker_type)]"
        >
          {{ item.price }}
        </span>
      </template>
    </z-table>
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component
export default class Trades extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;

  get COLUMN() {
    return [
      { title: "Time", key: "created_at", class_name: "time", algin: "left" },
      {
        title: `Price(${this.market.quote_unit.toUpperCase()})`,
        key: "price",
        algin: "center",
        scopedSlots: true
      },
      {
        title: `Amount(${this.market.base_unit.toUpperCase()})`,
        key: "amount",
        algin: "right"
      }
    ];
  }

  get trades() {
    const trades = [...this.TradeController.trades].slice(0, 15);

    return trades.map(trade => {
      return {
        price: this.getPrice(trade.price),
        amount: this.getAmount(trade.amount),
        taker_type: trade.taker_type,
        created_at: helpers.getDate(trade.created_at).split(" ")[1]
      };
    });
  }

  trendType(value: ZTypes.OrderSide) {
    return helpers.trendType(value);
  }
}
</script>
