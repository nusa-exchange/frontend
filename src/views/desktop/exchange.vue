<template>
  <div :key="identifier" class="page-exchange" :class="[TradeController.exchange_layout, { 'hide-pairs-table': hide_pairs_table }]">
    <TickerStatus
      :button-hide-market-list="TradeController.exchange_layout == 'basic'"
      :hide_pairs_table="hide_pairs_table"
      @update-hide="val => (hide_pairs_table = val)"
    />
    <OrderBook />
    <Chart />
    <TradeAction />
    <MarketList v-if="!hide_pairs_table && TradeController.exchange_layout == 'pro' || TradeController.exchange_layout == 'basic'" />
    <z-card v-if="TradeController.exchange_layout == 'basic'" v-model="trades_tab_active_key" class="trades" :tab-list="tradesTabList">
      <MarketTrades :loading="loading" v-show="trades_tab_active_key == 'market_trades'" />
      <MyTrades v-show="trades_tab_active_key == 'my_trades'" />
    </z-card>
    <MarketTrades v-else :loading="loading" />
    <MineControl />
  </div>
</template>

<script lang="ts">
import { ExchangeBaseMixin } from '@/mixins/exchange';
import { Component, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    MarketList: () => import("@/layouts/desktop/exchange/market-list"),
    TickerStatus: () => import("@/layouts/desktop/exchange/_ticker.vue"),
    OrderBook: () => import("@/layouts/desktop/exchange/orderbook"),
    Chart: () => import("@/layouts/desktop/exchange/chart"),
    MineControl: () =>
      import("@/layouts/desktop/exchange/_mine_control.vue"),
    MarketTrades: () =>
      import("@/layouts/desktop/exchange/_market_trades.vue"),
    MyTrades: () =>
      import("@/layouts/desktop/exchange/MyTrades.vue"),
    TradeAction: () => import("@/layouts/desktop/exchange/trade-action"),
  }
})
export default class PageExchangePro extends Mixins(ExchangeBaseMixin) {
  trades_tab_active_key = "market_trades";
  tradesTabList = [
    {
      key: "market_trades",
      text: "Market Trades",
    },
    {
      key: "my_trades",
      text: "My Trades"
    }
  ]
  hide_pairs_table = false;
  
  mounted() {
    if (window.innerWidth < 1600) {
      this.hide_pairs_table = true;
    }
  }
}
</script>

<style lang="less">
.basic {
  &.page-exchange {
    height: auto;
    display: grid;
    padding: 4px;
    gap: 4px;
    grid-template-columns: 1fr minmax(253px, 320px) minmax(500px, 870px) minmax(253px, 320px) 1fr;
    grid-template-rows: 64px 380px 80px 1.15fr 320px;
    grid-template-areas:
        "left ticker ticker trade-pairs right"
        "left orderbook chart trade-pairs right"
        "left orderbook chart trades right"
        "left orderbook trade-action trades right"
        "left mine-control mine-control mine-control right";

    .orderbook {
      .depth-overlay-content {
        transform: translateX(103%) translateY(-50%);
      }
    }

    .page-trade-pairs {
      .z-table {
        min-height: calc(100% - 66px);
      }
    }

    .trades {
      .market-trades, .my-trades {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.pro {
  &.page-exchange {
    height: calc(100vh - 48px);
    display: grid;
    padding: 4px;
    gap: 4px;
    grid-template-columns: minmax(253px, 320px) 1fr minmax(253px, 320px) minmax(253px, 320px);
    grid-template-rows: 64px auto 1fr 260px;
    grid-template-areas:
        "trade-pairs ticker trade-action trade-action"
        "trade-pairs chart trade-action trade-action"
        "trade-pairs chart orderbook trades"
        "trade-pairs mine-control orderbook trades";

    &.hide-pairs-table {
      grid-template-areas:
        "ticker ticker trade-action trade-action"
        "chart chart trade-action trade-action"
        "chart chart orderbook trades"
        "mine-control mine-control orderbook trades";
    }
  }
}

.page-exchange {
  .ticker-info {
    width: 100%;
    height: 100%;
    grid-area: ticker / ticker / ticker / ticker;
  }

  .orderbook {
    width: 100%;
    height: 100%;
    grid-area: orderbook / orderbook / orderbook / orderbook;
  }
  
  .page-exchange-chart {
    width: 100%;
    height: 100%;
    grid-area: chart / chart / chart / chart;
  }

  .trade-action {
    width: 100%;
    height: 100%;
    grid-area: trade-action / trade-action / trade-action / trade-action;
  }

  .page-trade-pairs {
    width: 100%;
    height: 100%;
    grid-area: trade-pairs / trade-pairs / trade-pairs / trade-pairs;
  }

  .trades {
    width: 100%;
    height: 100%;
    grid-area: trades / trades / trades / trades;
  }

  .page-trade-mine-control {
    width: 100%;
    height: 100%;
    grid-area: mine-control / mine-control / mine-control / mine-control;
  }

  .market-trades {
    width: 100%;
    height: 100%;
    grid-area: trades / trades / trades / trades;
  }
}
</style>
