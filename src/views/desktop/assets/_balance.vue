<template>
  <div class="assets-main balance">
    <div class="assets-head">
      <span class="total">
        <span class="label">{{ translation("balance.estimated_value") }}:</span>
        <span class="usdt">{{ total_usdt }} USDT</span>
        <span class="usd">≈ {{ total_usd }} USD</span>
      </span>
      <div class="assets-finder">
        <a-checkbox @click="hide_smallChange">
          {{ translation("balance.hide_small") }}
          <a-tooltip placement="right">
            <template slot="title">
              <span>prompt text</span>
            </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </a-checkbox>
        <div class="search">
          <input
            v-model="search"
            :placeholder="$t('page.global.table.search')"
            maxlength="9"
            type="text"
          />
          <i class="ivu-icon ivu-icon-ios-search-outline" />
        </div>
      </div>
    </div>
    <div class="assets-body">
      <div class="table-content">
        <dl class="head">
          <span class="coin" v-text="$t('page.global.table.coin')" />
          <span class="name" v-text="$t('page.global.table.name')" />
          <span class="total" v-text="$t('page.global.table.total')" />
          <span class="available" v-text="$t('page.global.table.available')" />
          <span class="locked" v-text="$t('page.global.table.locked')" />
          <span class="btc_val" v-text="$t('page.global.table.btc_val')" />
          <span class="text-center action" v-text="$t('page.global.table.action')" />
        </dl>
        <dd>
          <balance-row
            v-for="currency in currencies"
            :key="currency.id"
            :currency_id="currency.id"
          />
        </dd>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PublicController } from "@/controllers";
import * as helpers from "@/library/z-helpers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "balance-row": () => import("./modules/balance-row.vue")
  }
})
export default class Balance extends Vue {
  loading = false;
  hide_small = false;
  search = "";

  get currencies() {
    let currencies = PublicController.currencies;

    if (this.search.length) {
      currencies = currencies.filter(currency => {
        return currency.id.toLowerCase().includes(this.search) || currency.name.toLowerCase().includes(this.search.toLowerCase());
      });
    }
    if (this.hide_small) {
      currencies = currencies.filter(currency => {
        const btcAmount = new helpers.Balance(currency.id).getTotalBTC();
        return btcAmount >= 0.001;
      });
    }

    return currencies;
  }

  get total_usdt() {
    let value = 0;
    const currencies = this.PublicController.currencies;
    currencies.forEach(currency => {
      value += Number(new helpers.Balance(currency.id).getTotalUSDT());
    });
    return value.toFixed(2);
  }

  get total_usd() {
    const price = this.PublicController.global_price.USDT;
    if (price) return (price.USD * Number(this.total_usdt)).toFixed(2);
    else return 0;
  }

  hide_smallChange() {
    this.hide_small = !this.hide_small;
  }

  translation(message, data = {}) {
    return helpers.translation("page.assets." + message, data);
  }
};
</script>
