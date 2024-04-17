<template>
  <div class="assets-main history">
    <div class="assets-head" />
    <div class="assets-body">
      <div class="select">
        <!---->
        <div class="form-row">
          <label class="form-label">{{ $t("page.global.table.coin") }}:</label>
          <div class="form-control">
            <a-select
              v-model="currency"
              show-search
              placeholder="input search text"
              option-filter-prop="children"
              :filter-option="filterOption"
              style="width:115px"
              @change="setCurrency"
            >
              <a-select-option v-for="data in ['All', ...CURRENCY]" :key="data">
                {{ data === "All" ? data : data.toUpperCase() }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!---->
        <div class="form-row">
          <label class="form-label">{{ $t("page.global.table.type") }}:</label>
          <div class="form-control">
            <a-select v-model="type" style="width:115px" @change="setType">
              <a-select-option v-for="data in TYPE" :key="data">
                {{ data }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!---->
      </div>
      <div class="table-content">
        <dl class="head">
          <span class="status" v-text="$t('page.global.table.status')" />
          <span class="coin" v-text="$t('page.global.table.coin')" />
          <span class="network" v-text="$t('page.global.table.network')" />
          <span class="amount" v-text="$t('page.global.table.amount')" />
          <span class="date" v-text="$t('page.global.table.date')" />
          <span class="infomation" v-text="$t('page.global.table.infomation')" />
          <span class="action text-right" v-text="$t('page.global.table.action')" />
        </dl>
        <dd :class="{ loading: loading, empty: !history.data.length }">
          <dl
            v-if="!history.data.length"
            v-text="translation('history.empty')"
          />
          <history-row
            v-for="(data, index) in history.data"
            :key="index"
            :type="type.toLowerCase()"
            :record="data"
          />
          <a-spin v-if="loading" size="large">
            <a-icon
              slot="indicator"
              type="loading"
              style="font-size: 24px"
              spin
            />
          </a-spin>
        </dd>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ApiClient from "@/library/z-apiclient";
import * as helpers from "@/library/z-helpers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "history-row": () => import("./modules/history-row.vue"),
  }
})
export default class AssetsHistory extends Vue {
  TYPE = ["Deposit", "Withdraw"];
  currency = "All";
  type = "Deposit";

  history = {
    data: [],
    page: 1,
    max: 0
  };

  loading = false;

  get CURRENCY() {
    return helpers.CURRENCY();
  }

  mounted() {
    this.getData();
  }

  setCurrency(currency) {
    this.currency = currency;
    this.getData();
  }

  setType(type) {
    this.type = type;
    this.getData();
  }

  async getData() {
    const payload = this.buildPayload();
    const type = this.type === this.TYPE[0] ? "deposits" : "withdraws";
    this.history.data = [];
    this.loading = true;

    try {
      const response = await new ApiClient("trade").get(
        "account/" + type,
        payload
      );
      this.history.data = response.data;
      this.history.max = response.headers.total;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  buildPayload() {
    return {
      currency: this.currency != "All" ? this.currency.toLowerCase() : "",
      limit: 25,
      page: this.history.page
    };
  }

  filterOption(input, option) {
    const value = option.componentOptions.children[0].text;
    if (value === "All") return false;

    return value.toUpperCase().includes(input.toUpperCase());
  }

  translation(message, data = {}) {
    return helpers.translation("page.assets." + message, data);
  }
}
</script>
