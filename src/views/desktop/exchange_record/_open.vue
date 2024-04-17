<template>
  <div class="order-main">
    <div class="order-head" v-text="$t('page.global.header.orders.open_orders')" />
    <div class="order-body">
      <div class="select">
        <!---->
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
              <a-select-option v-for="type in TYPE" :key="type" :value="type">
                {{ type }}
              </a-select-option>
            </a-select>
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
          <span v-text="$t('page.global.table.executed')" />
          <span v-text="$t('page.global.table.unexecuted')" />
          <span class="text-right action" v-text="$t('page.global.table.action')" />
        </dt>
        <dd :class="{ empty: !array.data.length }">
          <p v-for="(data, index) in array.data" :key="index">
            <span v-text="getDate(data.created_at)" />
            <span v-text="PublicController.tickers[data.market].name" />
            <span :class="trendType(data.side)" v-text="data.side" />
            <span v-text="getPrice(data.price, data.market)" />
            <span v-text="getAmount(data.origin_volume, data.market)" />
            <span v-text="getAmount(data.executed_volume, data.market)" />
            <span v-text="getAmount(data.remaining_volume, data.market)" />
            <span class="text-right action">
              <i
                v-if="data.state === 'wait' || data.state === 'pending'"
                class="zicon-close"
                @click="CloseOrder(data.uuid)"
              />
            </span>
          </p>
          <z-loading v-if="loading" />
          <p v-else-if="!array.data.length">
            <span v-text="$t('page.orders.open_orders.empty')" />
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
import { Mixins, Component, Watch } from "vue-property-decorator";
import ExchangeRecordMixins from "./mixins";

@Component
export default class OpenOrdersExchangeRecord extends Mixins(
  ExchangeRecordMixins
) {
  async getData(page = 1) {
    this.loading = true;
    try {
      const response = await this.TradeController.get_orders({
        market: this.market != "All" ? this.market : "",
        state: "wait",
        limit: 25,
        type:
          this.type != "All"
            ? (this.type.toLowerCase() as ZTypes.OrderSide)
            : null,
        page
      });

      this.array.data = response.data;
      this.loading = false;
    } catch (error) {
      return error;
    }
  }

  async CloseOrder(uuid) {
    const success = await this.TradeController.stop_order(uuid);

    if (!success) return;

    const index = this.array.data.findIndex(order => order.uuid === uuid);

    this.array.data.splice(index, 1);
  }

  @Watch("market")
  onMarketChanged() {
    this.getData();
  }

  @Watch("type")
  onTypeChanged() {
    this.getData();
  }
}
</script>
