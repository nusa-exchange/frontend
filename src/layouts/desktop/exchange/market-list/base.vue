<template>
  <div class="page-trade-pairs">
    <div class="page-trade-pairs-search-wrapper">
      <input
        v-model="search"
        :placeholder="$t('page.global.table.search')"
        maxlength="9"
        type="text"
      />
      <a-icon type="search" />
    </div>
    <div class="page-trade-pairs-tabs">
      <span
        class="page-trade-pairs-tab favorites"
        :class="{
          'page-trade-pairs-tab-selected': tab_active_key === 'Favorites',
        }"
        @click="change_tab('Favorites')"
      >
        <i class="zicon-star" />
      </span>
      <span
        v-for="data in [...MARKET, tab_more_key]"
        class="page-trade-pairs-tab"
        :key="data"
        :class="{ 'page-trade-pairs-tab-selected': tab_active_key === data }"
        @click="change_tab(data)"
        v-text="data"
      />
      <span
        class="page-trade-pairs-tab page-trade-pairs-tab-more"
        @click="show_tab_more = !show_tab_more"
      >
        <a-icon type="caret-down" />
      </span>
      <div v-if="show_tab_more" class="page-trade-pairs-tab-more-table">
        <li
          v-for="data in MARKET_MORE.filter((market) => market != tab_more_key)"
          :key="data"
          @click="change_tab_more(data)"
        >
          <a-icon type="line" />
          <span>{{ data }}</span>
        </li>
      </div>
    </div>
    <z-table
      :columns="COLUMN"
      :data="findTickers"
      :no-empty="true"
      :hover="true"
      :scroll="true"
      :border="false"
      :selected="{ key: 'id', value: market.id }"
      :custom-tag="true"
      @click="on_table_click"
    >
      <template slot="tag" slot-scope="{ item }">
        <router-link
          :to="{
            name: 'ExchangePage',
            params: { name: item.name.replace('/', '-') },
            query: { type: TradeController.exchange_layout },
          }"
        >
          <div
            @click.prevent="TradeController.open_exchange(item.id)"
            style="width: 100%"
          >
            <span :class="`currency text-left`">
              <span
                :class="[
                  'favorite',
                  { 'favorite-selected': check_favorite(item.id) },
                ]"
              >
                <i class="zicon-star" @click.prevent="add_remove_favorite(item.id)" />
              </span>
              <span>{{ item.base_unit.toUpperCase() }}</span>
            </span>
            <span class="price text-right">
              {{ item.last }}
            </span>
            <span
              :class="[
                'change',
                `text-right`,
                `text-${getMarketPriceChange(item.id) >= 0 ? 'up' : 'down'}`,
              ]"
            >
              {{ item.price_change_percent }}
            </span>
          </div>
        </router-link>
      </template>
    </z-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@/library/z-helpers";
import config from "@/config";
import { PublicController, TradeController } from "@/controllers";

@Component
export default class MarketList extends Vue {
  tab_active_key = this.market.quote_unit.toUpperCase();
  tab_more_key = "";
  show_tab_more = false;
  search = "";
  totalRepeat = 0;
  sortBy = "";
  sortReverse = false;
  SORT = [
    {
      name: "currency",
      sortBy: "base_unit",
      enabled: false,
      class: "text-left",
    },
    { name: "price", sortBy: "last", enabled: true, class: "text-right" },
    { name: "change", sortBy: "change", enabled: true, class: "text-right" },
  ];

  get list_bid() {
    return [...config.list_bid];
  }

  get MARKET() {
    const { list_bid } = this;

    return [...list_bid].splice(0, 3);
  }

  get MARKET_MORE() {
    const { list_bid } = this;

    return [...list_bid].splice(3, this.list_bid.length);
  }

  get COLUMN() {
    return [
      {
        title: this.$t("page.global.table.currency"),
        key: "base_unit",
        class_name: "currency",
        algin: "left",
        scopedSlots: true,
      },
      {
        title: this.$t("page.global.table.price"),
        key: "last",
        class_name: "price",
        algin: "right",
        sorter: true,
      },
      {
        title: this.$t("page.global.table.change"),
        key: "price_change_percent",
        class_name: "change",
        algin: "right",
        scopedSlots: true,
        sorter: true,
      },
    ];
  }

  get market() {
    return TradeController.market;
  }

  get findTickers() {
    const { tab_active_key, search } = this;

    let tickers = Object.values(PublicController.tickers);

    tickers = helpers.findTickersBase(tickers, "market", tab_active_key, true);
    if (this.search) {
      tickers = helpers.findTickersBase(tickers, "search", search, true);
    }

    return tickers;
  }

  mounted() {
    this.tab_more_key = this.MARKET_MORE[0];
  }

  change_tab_more(market: string) {
    this.tab_more_key = market;
    this.tab_active_key = this.tab_more_key;
    this.show_tab_more = false;
  }

  getMarketPriceChange(market = null) {
    return helpers.getMarketPriceChange(market);
  }

  check_favorite(market_id: string) {
    return PublicController.helpers.check_favorite(market_id);
  }

  add_remove_favorite(market_id: string) {
    PublicController.helpers.add_remove_favorite(market_id);
  }

  getPrice(value) {
    return Number(value).toFixed(this.market.price_precision);
  }

  getNameCurrencies(name) {
    const currencies = PublicController.currencies;
    for (const i in currencies) {
      if (currencies[i].id === name.toLowerCase()) {
        return currencies[i].name;
      }
    }
  }

  change_tab(tab: string) {
    this.tab_active_key = tab;
  }

  on_table_click(market) {
    if (this.market === market.id) return;

    TradeController.open_exchange(market.id);
  }
}
</script>

<style lang="less">
@trade-pairs-prefix-cls: ~"page-trade-pairs";

.@{trade-pairs-prefix-cls} {
  background-color: var(--bg-card-color);

  &-search-wrapper {
    position: relative;
    padding: 5px 5px;
    height: 30px;
    width: 100%;
    line-height: 0;

    input {
      border-radius: 3px;
      border: 1px solid var(--border-color);
      height: 100%;
      width: 100%;
      padding-left: 32px;

      &::placeholder {
        color: var(--color-gray);
      }
    }

    i {
      position: absolute;
      left: 8px;
      top: calc(50% - 10px);
      font-size: 20px;
      color: var(--color-gray);
    }
  }

  &-tabs {
    position: relative;
    display: flex;
    height: 36px;
    line-height: 36px;
    background: var(--selected-bg-color);

    .@{trade-pairs-prefix-cls}-tab {
      flex: 1 1;
      padding: 0 4px;
      text-align: center;
      border-right: 1px solid var(--bg-card-color);
      cursor: pointer;

      i {
        font-size: 18px;
      }

      &-more {
        flex: 0;
        padding: 0 2px;

        i {
          font-size: 12px;
        }

        &-table {
          position: absolute;
          top: 100%;
          right: 0;
          width: 70px;
          background: var(--bg-downdown-color);
          z-index: 1;

          > li {
            display: block;
            width: 100%;
            padding-left: 8px;
            font-size: 14px;
            line-height: 26px;
            text-align: left;
            cursor: pointer;

            &:hover {
              background-color: var(--blue-color);
            }

            i {
              font-size: 10px;
              padding-right: 8px;
            }
          }
        }
      }

      &-selected {
        background: var(--blue-color);
      }
    }
  }

  .z-table {
    &-row {
      height: 32px;
      line-height: 32px;
    }
  }

  .z-table-row {
    border-left: 4px solid transparent;
    &-row {
      height: 30px;
      line-height: 30px;
    }

    &-selected {
      border-color: var(--blue-color);
    }

    a {
      width: 100%;
      height: 32px;
      line-height: 32px;
      color: var(--text-default-color);

      > div {
        display: flex;
        width: 100%;
        height: 32px;
        line-height: 32px;
      }

      > span {
        height: 32px;
        line-height: 32px;
      }
    }

    span.currency {
      > span {
        display: inline-block;
        font-weight: 500;
        & + span {
          margin-left: 6px;
        }
      }
    }

    span.favorite {
      text-align: center;
      color: #728bb9;

      &-selected {
        color: var(--blue-color);
      }
      i {
        font-size: 14px;
        vertical-align: baseline;
      }
    }
  }
}
</style>

