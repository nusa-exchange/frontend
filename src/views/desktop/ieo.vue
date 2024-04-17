<template>
  <z-content v-if="!loading" class="page-ieo">
    <div class="buy-box-container">
      <div class="container">
        <div class="info-box">
          <div class="currency-info">
            <img class="currency-icon" :src="get_currency_icon(ieo.currency_id)" />
            <div class="currency-name">
              <span>{{ currency_name }}</span>
              <p v-if="IsCompleted" class="ieo-state bg-warn">Completed</p>
              <p v-else-if="isActive" class="ieo-state bg-up">Active Now</p>
              <p v-else class="ieo-state bg-down">Not Ready</p>
            </div>
          </div>

          <div :key="time_count_key" class="time-count">
            <div class="time-count-item">
              <div class="time-count-item-value">
                {{ time_count.days }}
              </div>
              <div class="time-count-item-title">
                DAY
              </div>
            </div>
            <div class="time-count-padding">:</div>
            <div class="time-count-item">
              <div class="time-count-item-value">
                {{ time_count.hours }}
              </div>
              <div class="time-count-item-title">
                HOUR
              </div>
            </div>
            <div class="time-count-padding">:</div>
            <div class="time-count-item">
              <div class="time-count-item-value">
                {{ time_count.minutes }}
              </div>
              <div class="time-count-item-title">
                MIN
              </div>
            </div>
          </div>

          <div class="time-line">
            {{ moment.unix(start_time).utc().format('MMM DD, YYYY / hh:mm:ss') }}
            -
            {{ moment.unix(end_time).utc().format('MMM DD, YYYY / hh:mm:ss') }}
            <span class="text-up">(UTC+0)</span>
          </div>

          <div class="payment-currency">
            <span v-for="pc in payment_currencies" :key="pc" class="payment-currency-item">
              {{ pc.toUpperCase() }} ≈ {{ pc == ieo.main_payment_currency ? ieo.price : round_number(Number(ieo.price) / Number(get_currency(pc).price)) }}
            </span>
          </div>
        </div>
        <div class="r-box">
          <div class="status-box">
            <div class="total-sold">
              <span class="title">Total sold:</span> <span class="text-up">{{ ieo.executed_quantity }}/{{ ieo.origin_quantity }}</span>
            </div>
            <div class="distributors">
              <span class="title">Distributors:</span> <span class="text-up">{{ ieo.distributors }}</span>
            </div>
          </div>
          <div class="buy-box">
            <div class="buy-box-title">
              <span>
                Buy {{ currency_id }}
              </span>
              <div class="deposit-box">
                <router-link to="/assets/balance">Deposit</router-link>
                <p v-if="isAuth">Available: {{ balance }} {{ payment_currency.toUpperCase() }}</p>
              </div>
            </div>

            <ieo-input v-model="total" placeholder="Payment" :placeholderNeed="true" @focus="totalFocus = true" @blur="totalFocus = false" :error="total_error">
              <template slot="right-action">
                <a-dropdown placement="bottomRight" :trigger="['click']" overlayClassName="idr-dropdown">
                  <a-menu slot="overlay" @click="handleMenuClick">
                    <a-menu-item v-for="pc in payment_currencies" :key="pc"><img class="currency-icon" :src="get_currency_icon(pc)" /> {{ pc.toUpperCase() }}</a-menu-item>
                  </a-menu>
                  <span><img class="currency-icon" :src="get_currency_icon(payment_currency)" />{{ payment_currency.toUpperCase() }} <a-icon type="down" /></span>
                </a-dropdown>
              </template>
            </ieo-input>
            <div class="buy-box-price">1 {{ currency_id }} ~ {{ price }} {{ payment_currency.toUpperCase() }}</div>
            <ieo-input v-model="quantity" placeholder="Total in tokens" :placeholderNeed="true" :error="quantity_error" @focus="quantityFocus = true" @blur="quantityFocus = false" />
            <div class="bought-quantity">
              <span class="bought-quantity-title">
                Bought Amount:
              </span>
              {{ ieo.bought_quantity }}/{{ ieo.limit_per_user }}
            </div>
            <button :disabled="button_disabled" @click="create_ieo_order"><a-icon v-if="button_loading" type="loading" /> Buy {{ currency_name }}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="intro-content container" v-html="intro_data" />
  </z-content>
</template>

<script lang="ts">
import { runNotice } from '@/mixins';
import moment from 'moment';
import { Vue, Component, Watch } from 'vue-property-decorator'
import Decimal from "decimal.js";

@Component({
  components: {
    "ieo-input": () => import("@/layouts/desktop/ieo/input.vue")
  }
})
export default class PageIEO extends Vue {
  loading = true;
  ieo?: ZTypes.IEO = null;
  button_loading = false;

  totalFocus = false;
  quantityFocus = false;

  payment_currency = "";
  total = "";
  quantity = "";

  time_count_interval: NodeJS.Timeout;
  time_count_key = 0;

  get Decimal() {
    return Decimal;
  }

  get isAuth() {
    return this.UserController.isAuth;
  }

  get balance() {
    return this.UserController.balances.find(b => b.currency === this.payment_currency)?.balance;
  }

  get button_disabled() {
    return this.quantity_error || this.total_error || this.quantity.length == 0 || !this.UserController.isAuth || Number(this.quantity) + Number(this.ieo.bought_quantity) > Number(this.ieo.limit_per_user) || this.button_loading || this.IsCompleted || !this.isActive || !this.isAuth;
  }

  get price() {
    const price = Number(this.ieo.price) / Number(this.get_currency(this.payment_currency).price);

    return this.round_number(price);
  }

  get currency_name() {
    return this.PublicController.currencies.find(c => c.id === this.ieo?.currency_id)?.name;
  }

  get currency_id() {
    return this.ieo?.currency_id?.toUpperCase();
  }

  get payment_currencies() {
    return this.ieo?.payment_currencies || [];
  }

  get moment() {
    return moment;
  }

  get start_time() {
    return this.ieo?.start_time || 0;
  }

  get end_time() {
    return this.ieo?.end_time || 0;
  }

  get intro_data() {
    return this.ieo?.data || "";
  }

  get total_error() {
    if (this.total.length == 0) return

    if (Number(this.total) > Number(this.balance)) return "Max. total is " + this.balance
  }

  get quantity_error() {
    if (this.quantity.length == 0) return

    if (Number(this.quantity) + Number(this.ieo.bought_quantity) > Number(this.ieo.limit_per_user)) return "Max. amount is " + (Number(this.ieo.limit_per_user) - Number(this.ieo.bought_quantity)).toFixed(2)
    if (Number(this.quantity) < Number(this.ieo.min_amount)) return "Min. amount is " + this.ieo.min_amount
  }

  get IsCompleted() {
    return this.ieo.executed_quantity === this.ieo.origin_quantity;
  }

  get isActive() {
    const current_time = new Date().getTime() / 1000;

    return current_time >= this.ieo.start_time && current_time <= this.ieo.end_time;
  }

  get time_count() {
    const current_unix = moment().unix();
    const time_left = (this.ieo?.end_time || 0) - current_unix;

    var days = Math.floor(time_left / (3600*24));
    var hours = Math.floor(time_left % (3600*24) / 3600);
    var minutes = Math.floor(time_left % 3600 / 60);

    return {
      days: days > 0 ? days : 0,
      hours: hours > 0 ? hours: 0,
      minutes: minutes > 0 ? minutes : 0,
      time_count_key: this.time_count_key,
    }
  }

  mounted() {
    this.get_ieo();

    this.time_count_interval = setInterval(() => {
      this.time_count_key++;
    }, 1000);
  }

  beforeDestroy() {
    clearInterval(this.time_count_interval);
  }

  round_number(num: number) {
    return new Decimal(num.toFixed(8))
  }

  async create_ieo_order() {
    if (this.button_disabled) return;

    this.button_loading = true;

    try {
      await this.TradeController.create_ieo_order(this.ieo.id, this.payment_currency, this.quantity);
      runNotice("success", "ieo.bought");
      this.ieo.bought_quantity = (Number(this.ieo.bought_quantity) + Number(this.quantity)).toString();
      this.quantity = "";
    } catch (error) {
      return error;
    } finally {
      this.button_loading = false;
    }
  }

  get_currency(id: string) {
    return this.PublicController.currencies.find(c => c.id == id);
  }

  get_currency_icon(id: string) {
    return (this.PublicController.currencies.find(c => c.id == id) as any)?.icon_url;
  }

  async get_ieo() {
    this.loading = true;

    try {
      const { data } = await this.TradeController.fetch_ieo(Number(this.$route.params.id));
      this.ieo = data;
      this.payment_currency = this.ieo.main_payment_currency;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  handleMenuClick({ key }) {
    this.payment_currency = key;
  }

  round_precision(value: string, precision: number) {
    const value_with_split = value.split(".");
    const n1 = value_with_split[0];
    const n2 = value_with_split[1];

    if (precision === 0) {
      return n1;
    } else if (n2) {
      return [n1, n2.slice(0, precision)].join(".");
    } else {
      return value;
    }
  }

  @Watch("total")
  onTotalChanged() {
    if (!this.totalFocus) return;

    this.quantity = (Number(this.total) / Number(this.price)).toString();
    this.quantity = this.round_precision(this.quantity, 8);
    this.quantity = this.round_number(Number(this.quantity)).toString();
  }

  @Watch("quantity")
  onQuantityChanged() {
    if (!this.quantityFocus) return;

    this.total = (Number(this.quantity) * Number(this.price)).toString();
    this.total = this.round_precision(this.total, 8);
    this.total = this.round_number(Number(this.total)).toString();
  }

  
  @Watch("payment_currency")
  onPaymentCurrencyChanged() {
    this.total = "";
    this.quantity = "";
  }
}
</script>

<style lang="less">
.page-ieo {
  .buy-box-container {
    background-color: var(--bg-card-color);
    height: 500px;
    padding-top: 60px;
    padding-bottom: 80px;

    .container {
      display: flex;
      justify-content: space-between;
    }
  }

  .status-box {
    margin-right: 20px;
    font-size: 16px;

    .title {
      color: var(--color-gray);
      font-size: 16px;
    }

    .distributors {
      margin-top: 12px;
    }
  }

  .deposit-box {
    text-align: right;
    font-size: 14px;

    p {
      font-weight: normal;
      font-size: 12px;
    }

    a {
      color: var(--blue-color);
    }
  }

  .info-box {
    .currency-info {
      display: flex;
      align-items: center;
    }

    .currency-icon {
      width: 50px;
      height: 50px;
      margin-right: 24px;
    }

    .currency-name {
      font-size: 30px;
      font-weight: 500;

      .ieo-state {
        text-align: center;
        padding: 4px 6px;
        border-radius: 50px;
        font-size: 10px;
      }
    }

    .time-count {
      display: flex;
      text-align: center;
      margin-top: 40px;

      &-padding {
        font-size: 24px;
        font-weight: 500;
        margin: 7px 8px 0;
      }

      &-item {
        padding: 6px 10px;

        &-value {
          font-size: 24px;
          font-weight: 500;
        }

        &-title {
          font-size: 10px;
          font-weight: 500;
        }
      }
    }

    .time-line {
      width: 100%;
      padding-bottom: 24px;
      margin-top: 40px;
      font-size: 14px;
      font-weight: 500;
      border-bottom: 1px solid var(--border-color);
      padding-left: 12px;
      padding-right: 12px;
    }

    .payment-currency {
      margin-top: 24px;
      font-size: 16px;

      &-item {
        margin-right: 12px;
      }
    }
  }

  .buy-box {
    width: 450px;
    padding: 50px;
    background-color: var(--bg-head-color);

    &-title {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ieo-input {
      margin-top: 16px;

      &:first-child {
        margin-top: 0;
      }
    }

    &-price {
      color: var(--color-gray);
      font-weight: 500;
      font-size: 12px;
      margin-top: 12px;
      text-align: right;
    }

    .bought-quantity {
      margin-top: 12px;

      &-title {
        color: var(--color-gray);
      }
    }

    button {
      margin-top: 24px;
      width: 100%;
      background-color: var(--up-color);
      font-weight: 500;
      font-size: 14px;
      height: 50px;

      &:disabled {
        background-color: var(--disabled-color);
        cursor: disabled;
      }
    }
  }

  .intro-content {
    margin-top: 20px;

    img {
      width: 100%;
    }
  }

  .currency-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 8px;
    display: initial;
  }

  .z-auth-input-right-action {
    cursor: pointer;
    padding-left: 12px;
    border-left: 1px solid var(--border-color);

    .ant-dropdown-trigger {
      display: flex;
      height: 50px;
      line-height: 50px;
      align-items: center;

      i {
        margin-left: 4px;
      }
    }
  }

  .r-box {
    display: flex;
  }
}

.idr-dropdown {
  border-radius: 0;
  box-shadow: none;

  .currency-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
</style>
