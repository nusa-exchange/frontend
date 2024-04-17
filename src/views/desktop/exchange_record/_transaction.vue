<template>
  <div class="order-main">
    <div class="order-head" v-text="$t('page.global.header.orders.trades_history')" />
    <div class="order-body">
      <div class="select">
        <div class="form-row">
          <label class="form-label">{{ $t("page.global.table.market") }}:</label>
          <div class="form-control">
            <a-select v-model="market" style="width: 115px">
              <a-select-option
                v-for="market in PublicController.markets"
                :key="market.id"
                :value="market.id"
              >
                {{ market.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">{{ $t("page.global.table.type") }}:</label>
          <div class="form-control">
            <a-select v-model="type" style="width: 115px">
              <a-select-option v-for="data in TYPE" :key="data">
                {{ data }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">{{ $t("page.global.table.date") }}:</label>
          <div class="form-control datepicker">
            <a-range-picker v-model="timeMoment">
              <template slot="dateRender" slot-scope="current">
                <div
                  class="ant-calendar-date"
                  :style="getCurrentStyle(current)"
                >
                  {{ current.date() }}
                </div>
              </template>
            </a-range-picker>
          </div>
        </div>
        <div class="form-row">
          <div class="form-control">
            <button type="submit" @click="getData()">Query</button>
          </div>
        </div>
      </div>
      <div class="table-content">
        <dt>
          <span v-text="$t('page.global.table.date')" />
          <span v-text="$t('page.global.table.pair')" />
          <span v-text="$t('page.global.table.type')" />
          <span v-text="$t('page.global.table.price')" />
          <span v-text="$t('page.global.table.amount')" />
          <span v-text="$t('page.global.table.total')" />
        </dt>
        <dd :class="{ empty: !array.data.length }">
          <p
            v-for="(data, index) in array.data"
            :key="index"
            :removing="!!data.removing"
          >
            <span v-text="getDate(data.created_at)" />
            <span v-text="PublicController.tickers[data.market].name" />
            <span :class="[trendType(data.side), 'type']" v-text="data.side" />
            <span v-text="getPrice(data.price, data.market)" />
            <span v-text="getAmount(data.amount, data.market)" />
            <span v-text="getTotal(data.total, data.market)" />
          </p>
          <z-loading v-if="loading" />
          <p v-else-if="!array.data.length">
            <span v-text="$t('page.orders.trades_history.empty')" />
          </p>

          <z-pagination
            v-model="array.page"
            :loading="loading"
            size="small"
            class="text-right"
            :page-size="25"
            :count-row="array.data.length"
            @change="getData"
          />
        </dd>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Moment } from "moment";
import { Mixins, Component } from "vue-property-decorator";
import ExchangeRecordMixins from "./mixins";

@Component
export default class OpenOrdersExchangeRecord extends Mixins(
  ExchangeRecordMixins
) {
  timeMoment: Moment[] = [];

  get time() {
    return this.timeMoment.map((row) => row.toDate().getTime() / 1000);
  }

  getCurrentStyle(current) {
    const style: { [key: string]: string } = {};
    if (current.date() === 1) {
      style.border = "1px solid var(--blue-color)";
      style.borderRadius = "50%";
    }
    return style;
  }

  async getData(page = 1, limit = 25) {
    this.loading = true;
    try {
      const response = await this.TradeController.get_trades({
        market: this.market != "All" ? this.market : null,
        type:
          this.type != "All"
            ? (this.type.toLowerCase() as ZTypes.OrderSide)
            : null,
        time_from:
          this.time.length >= 1
            ? parseInt((new Date(this.time[0]).getTime() / 1000).toString())
            : null,
        time_to:
          this.time.length >= 2
            ? parseInt((new Date(this.time[1]).getTime() / 1000).toString())
            : null,
        limit,
        page,
      });
      this.array.data = response.data;
      this.array.max = Number(response.headers.total);
      this.loading = false;
    } catch (error) {
      return error;
    }
  }
}
</script>
