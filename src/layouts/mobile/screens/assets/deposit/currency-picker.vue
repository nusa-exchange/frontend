<template>
  <div class="assets-deposit-currency-picker" @click="$emit('click')">
    <div class="assets-deposit-currency-logo">
      <div class="assets-deposit-currency-logo-wrapper">
        <div class="assets-deposit-currency-logo-content">
          <img :src="currency.icon_url" />
        </div>
      </div>
    </div>
    <div class="assets-deposit-currency-code">
      {{ currency.id.toUpperCase() }}
    </div>
    <div class="assets-deposit-currency-name">
      {{ currency.name }}
    </div>
    <div class="assets-deposit-currency-action">
      <a-icon type="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DepositCurrencyPicker extends Vue {
  @Prop() readonly currency!: ZTypes.Currency;
}
</script>
