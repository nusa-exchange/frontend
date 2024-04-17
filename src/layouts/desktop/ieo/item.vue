<template>
  <router-link :to="'/ieo/' + ieo.id" class="ieo-item">
    <img :src="ieo.banner_url" />
    <p v-if="IsCompleted" class="ieo-item-state bg-warn">Completed</p>
    <p v-else-if="IsActive" class="ieo-item-state bg-up">Active Now</p>
    <p v-else class="ieo-item-state bg-down">Not Ready</p>
    <div class="ieo-item-content">
      <p class="ieo-item-currency-code">{{ currency.id.toUpperCase() }}</p>
      <p><span class="ieo-item-row-title">{{ $t("page.ieo.available_currencies") }}:</span> {{ ieo.payment_currencies.join(", ").toUpperCase() }}</p>
      <p><span class="ieo-item-row-title">{{ $t("page.ieo.session_supply") }}:</span> {{ Number(ieo.origin_quantity).toLocaleString() }}</p>

      <div class="ieo-item-period">
        <p>
          <span class="text-up">
            <a-icon type="clock-circle" /> {{ $t("page.ieo.start") }}
          </span>
          <span>
            {{ moment.unix(ieo.start_time).utc().format('MMM DD, YYYY / hh:mm:ss') }} <span class="text-up">(UTC+0)</span>
          </span>
        </p>
        <p>
          <span class="text-down">
            <a-icon type="clock-circle" /> {{ $t("page.ieo.end") }}
          </span>
          <span>
            {{ moment.unix(ieo.start_time).utc().format('MMM DD, YYYY / hh:mm:ss') }} <span class="text-up">(UTC+0)</span>
          </span>
        </p>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import moment from 'moment';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class IEOItem extends Vue {
  @Prop() ieo!: ZTypes.IEO;

  get currency() {
    return this.PublicController.currencies.find(currency => currency.id == this.ieo.currency_id);
  }

  get moment() {
    return moment;
  }

  get IsCompleted() {
    return this.ieo.executed_quantity === this.ieo.origin_quantity;
  }

  get IsActive() {
    const current_time = new Date().getTime() / 1000;

    return current_time >= this.ieo.start_time && current_time <= this.ieo.end_time;
  }
}
</script>

<style lang="less">
.ieo-item {
  position: relative;
  display: inline-block;
  background-color: var(--bg-card-color);
  width: 350px;
  margin: 0 10px 25px;
  cursor: pointer;
  color: var(--text-default-color);

  &:hover {
    color: inherit;
  }

  &-content {
    padding: 30px 30px 12px 30px;
    font-weight: 500;
    font-size: 14px;

    > * {
      margin-bottom: 12px;
    }
  }

  &-state {
    position: absolute;
    top: 24px;
    right: 24px;
    text-align: center;
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 10px;
  }

  img {
    width: 100%;
  }

  &-currency-code {
    font-size: 20px;
    color: var(--text-dropdown-color);
  }

  &-row-title {
    color: var(--color-gray);
  }

  &-period {
    padding-top: 12px;
    border-top: 1px solid var(--border-color);

    p {
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      font-weight: normal;

      span {
        i {
          font-size: 18px;
          vertical-align: middle;
          line-height: 1;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
