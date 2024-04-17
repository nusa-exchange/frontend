<template>
  <div class="market-list">
    <div class="menu-table">
      <ul>
        <li
          :class="{
            selected: isSelected === 'Favorites'
          }"
          @click="changeSelect('Favorites')"
        >
          {{ $t("page.global.table.favorite") }}
        </li>
        <li
          v-for="(data, index) in list_bid"
          :key="index"
          :class="{ selected: isSelected === data }"
          @click="changeSelect(data)"
        >
          {{ $t("page.global.market", { currency: data }) }}
        </li>
      </ul>
      <div class="search">
        <input
          v-model="search"
          :placeholder="$t('page.global.table.search')"
          maxlength="9"
          type="text"
        />
        <a-icon type="search" />
      </div>
    </div>
    <div class="ex_table table_noscroll">
      <dt>
        <span
          v-for="(data, index) in sorts"
          :key="index"
          class="text-left"
          @click="changeSort(data.sortBy)"
        >
          <span>{{ data.text }}</span>
          <span class="sorter">
            <i
              v-if="sortBy === data.sortBy && !sortReverse"
              class="zicon-caret-up"
            />
            <i
              v-if="sortBy === data.sortBy && sortReverse"
              class="zicon-caret-down"
            />
          </span>
        </span>
      </dt>
      <dd>
        <market-list-row
          v-for="ticker in findTickers"
          :ticker="ticker"
          :key="ticker.id"
        />
      </dd>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@/library/z-helpers";
import config from "@/config";

@Component({
  components: {
    "market-list-row": () => import("./market-list-row.vue")
  }
})
export default class MarketList extends Vue {
  isSelected = "";
  search = "";
  sortBy: "name" | "last" | "change" | "high" | "low" | "volume" = "volume";
  sortReverse = false;

  get sorts() {
    return [
      { sortBy: "name", text: this.$t("page.global.table.pair") },
      { sortBy: "last", text: this.$t("page.global.table.last_price") },
      { sortBy: "change", text: this.$t("page.global.table.24h_change") },
      { sortBy: "high", text: this.$t("page.global.table.24h_high") },
      { sortBy: "low", text: this.$t("page.global.table.24h_low") },
      { sortBy: "volume", text: this.$t("page.global.table.24h_volume") }
    ];
  }

  get list_bid() {
    return [...config.list_bid];
  }

  get findTickers() {
    const { sortBy, sortReverse, isSelected, search } = this;
    const { findTickersBase } = helpers;

    let tickers = Object.values(this.PublicController.tickers);
    tickers = findTickersBase(tickers, "market", isSelected, true);
    if (this.search) {
      tickers = findTickersBase(tickers, "search", search, true);
    }

    tickers = Array.from(tickers).sort((first, second) =>
      String(first[sortBy]).localeCompare(second[sortBy].toString())
    );
    return sortReverse ? tickers.reverse() : tickers;
  }

  mounted() {
    this.isSelected = config.list_bid[0];
  }

  changeSort(sortBy) {
    if (this.sortBy != sortBy) {
      this.sortBy = sortBy;
      this.sortReverse = false;
      return;
    }
    this.sortReverse = !this.sortReverse;
  }

  changeSelect(symbol) {
    this.isSelected = symbol;
  }
};
</script>
