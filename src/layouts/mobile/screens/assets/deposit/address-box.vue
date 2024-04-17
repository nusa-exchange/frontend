<template>
  <div class="assets-deposit-address-box">
    <div class="assets-deposit-address-title">
      {{ currency.id.toUpperCase() }} Deposit Address:
    </div>
    <div class="assets-deposit-address-content">
      <div class="assets-deposit-address-qrcode">
        <qrcode
          :value="deposit_address"
          :size="125"
          level="L"
          background="transparent"
        />
      </div>
      <div class="assets-deposit-address-value">
        {{ deposit_address.toUpperCase() }}
      </div>
      <div class="assets-deposit-address-action">
        <button @click="copy_address"><a-icon type="copy" theme="filled" /> COPY ADDRESS</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { runNotice } from "@/mixins";
import * as helpers from "@/library/z-helpers";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    qrcode: () => import("@/components/desktop/qrcode")
  }
})
export default class DepositNotice extends Vue {
  @Prop() readonly currency!: ZTypes.Currency;
  @Prop() readonly deposit_address!: string;

  copy_address() {
    helpers.copyText(this.deposit_address);
    runNotice("success", "copy");
  }
}
</script>
