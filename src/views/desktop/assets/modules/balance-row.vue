<template>
  <dl :class="{ selected: showBox }">
    <span class="coin">{{ currency.id.toUpperCase() }}</span>
    <span class="name">{{ currency.name }}</span>
    <span class="total">{{ balance.total }}</span>
    <span class="available">{{ balance.available }}</span>
    <span class="locked">{{ balance.locked }}</span>
    <span class="btc_val">
      {{ balance.getTotalBTC() }}
      <p>≈ {{ balance.getTotalUSD() }} USD</p>
    </span>
    <span class="text-center action">
      <a
        :class="{
          selected: showBox && type === 'deposit'
        }"
        @click="changeAssets('deposit')"
        v-text="$t('page.global.action.deposit')"
      />
      <a
        :class="{
          selected: showBox && type === 'withdraw'
        }"
        @click="changeAssets('withdraw')"
        v-text="$t('page.global.action.withdrawal')"
      />
      <a-dropdown :trigger="['click']" placement="bottomCenter">
        <a class="ant-dropdown-link" href="#">
          {{ $t("page.global.action.exchange") }} <i class="zicon-arrow-down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item
            v-for="market in MARKET"
            :key="market.id"
          >
            <router-link :to="{
              name: 'ExchangePage',
              params: { name: market.name.replace('/', '-') },
              query: { type: 'pro' }
            }">
              {{ market.name }}
            </router-link>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </span>
    <div v-if="showBox" class="action-box">
      <deposit-box v-if="type === 'deposit'" :currency="currency" />
      <withdraw-box
        v-else-if="type === 'withdraw'"
        :available="balance.available"
        :currency="currency"
      />
    </div>
  </dl>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import ZSmartModel from "@/library/z-eventbus";
import _deposit from "@/layouts/desktop/assets/_deposit.vue";
import _withdraw from "@/layouts/desktop/assets/_withdraw.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { PublicController, TradeController } from "@/controllers";

@Component({
  components: {
    "deposit-box": _deposit,
    "withdraw-box": _withdraw
  }
})
export default class BalanceRow extends Vue {
  @Prop() readonly currency_id!: string;

  type = "";
  showBox = false;

  get MARKET() {
    const { currency } = this;
    return PublicController.markets.filter(market => {
      if (market.base_unit == currency.id) return market;
    });
  }

  get currency() {
    return PublicController.currencies.find(currency => currency.id == this.currency_id);
  }

  get balance() {
    return new helpers.Balance(this.currency.id);
  }

  mounted() {
    ZSmartModel.on("assets-box-open", this.clearShowBox);
  }

  beforeDestroy() {
    ZSmartModel.remove("assets-box-open", this.clearShowBox);
  }

  clearShowBox() {
    this.showBox = false;
    this.type = null;
  }

  beforeOpenBox() {
    ZSmartModel.emit("assets-box-open");
  }

  changeAssets(type) {
    if (this.type == type && this.showBox) {
      this.clearShowBox();
    } else {
      this.beforeOpenBox();
      this.type = type;
      this.showBox = true;
    }
  }

  changeMarket($market) {
    const marketArray = $market.split("/");
    const market_id = marketArray.join("").toLowerCase();

    TradeController.open_exchange(market_id);
  }
}
</script>
