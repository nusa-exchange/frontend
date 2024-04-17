<template>
  <div class="assets-deposit">
    <template v-if="currency.type === 'coin'">
      <div class="assets-form">
        <div class="assets-network">
          <a-button
            v-for="n in networks"
            :key="n.blockchain_key"
            :class="{ active: network.blockchain_key == n.blockchain_key }"
            type="primary"
            @click="change_network(n)"
          >{{ n.protocol }}</a-button>
        </div>
        <div class="address-box">
          <label
            class="address-label"
            v-text="$t('page.assets.deposit.deposit_address')"
          />
          <div class="address-form">
            <input type="text" :value="deposit_address || 'LOADING'" readonly />
            <a @click="copy_address" v-text="$t('page.global.action.copy')" />
            <a
              v-click-outside:mousedown.capture="show_qr_code"
              v-click-outside.capture="show_qr_code"
              @click="qrcode_show = true"
            >
              <span v-text="$t('page.assets.deposit.qr_code')" />
              <div class="show-qrcode" :class="{ active: qrcode_show }">
                <qrcode
                  v-if="deposit_address"
                  :value="deposit_address"
                  :size="110"
                  level="L"
                  background="transparent"
                />
              </div>
            </a>
          </div>
        </div>
        <a
          class="block-address"
          :href="network.explorer_address.replace('#{address}', deposit_address)"
          target="_blank"
        >
          Block Browser
        </a>
      </div>
      <div class="assets-note">
        <h3 v-text="$t('page.assets.instructions')" />
        <fix-i18n
          tag="p"
          class="desc"
          path="page.assets.deposit.coin.note"
          :places="{
            currency: currency.id.toUpperCase(),
            min_confirmations: network.min_confirmations
          }"
        >
          <br />
        </fix-i18n>
      </div>
    </template>
    <template v-else>
      <div class="assets-form">
        <div class="bank-info-box">
          <h1 class="bank-info-title">Deposit using bank transfer</h1>
          <div>
            <span class="bank-info-title">{{ $t("page.assets.deposit.fiat.bank_name.title") }}: </span>
            {{ $t(`page.assets.deposit.fiat.bank_name.value.${currency.id}`) }}
          </div>
          <div>
            <span class="bank-info-title">{{ $t("page.assets.deposit.fiat.account_number.title") }}: </span>
            {{ $t(`page.assets.deposit.fiat.account_number.value.${currency.id}`) }}
          </div>
          <div>
            <span class="bank-info-title">{{ $t("page.assets.deposit.fiat.account_name.title") }}: </span>
            {{ $t(`page.assets.deposit.fiat.account_name.value.${currency.id}`) }}
          </div>
          <div>
            <span class="bank-info-title">{{ $t("page.assets.deposit.fiat.phone_numer.title") }}: </span>
            {{ $t(`page.assets.deposit.fiat.phone_numer.value.${currency.id}`) }}
          </div>
          <div>
            <span class="bank-info-title">{{ $t("page.assets.deposit.fiat.reference_code.title") }}: </span>
            {{ UserController.uid }}
          </div>
        </div>
      </div>
      <div class="assets-note">
        <h3 v-text="$t('page.assets.instructions')" />
        <fix-i18n
          tag="p"
          class="desc"
          path="page.assets.deposit.fiat.note"
          :places="{
            currency: currency.id.toUpperCase()
          }"
        >
          <br />
        </fix-i18n>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { runNotice } from "@/mixins";
import ApiClient from "@/library/z-apiclient";
import { Vue, Component, Prop } from "vue-property-decorator";
import * as helpers from "@/library/z-helpers";

@Component({
  components: {
    qrcode: () => import("@/components/desktop/qrcode")
  }
})
export default class DepositBox extends Vue {
  @Prop() public readonly currency!: ZTypes.Currency;

  deposit_address = "";
  blockchain_key?: string = null;
  qrcode_show = false;

  get networks() {
    return this.currency.networks;
  }

  get network() {
    return this.networks.find(network => this.blockchain_key == network.blockchain_key);
  }

  created() {
    if (this.currency.type == "coin") {
      this.blockchain_key = this.currency.networks[0].blockchain_key;
    }
  }

  mounted() {
    if (this.currency.type == "coin") {
      this.getDepositAddress();
    }
  }

  change_network(network: ZTypes.Network) {
    this.deposit_address = "";
    this.blockchain_key = network.blockchain_key;
    this.getDepositAddress();
  }

  async getDepositAddress() {
    try {
      const { data } = await new ApiClient("trade").get(
        "account/deposit_address/" + this.currency.id, { blockchain_key: this.network.blockchain_key }
      );
      this.deposit_address = data.address;
    } catch (error) {
      return error;
    } finally {
      if (!this.deposit_address) {
        setTimeout(() => {
          this.getDepositAddress();
        }, 3000);
      }
    }
  }

  copy_address() {
    helpers.copyText(this.deposit_address);
    runNotice("success", "copy");
  }

  show_qr_code() {
    this.qrcode_show = false;
  }
}
</script>

<style lang="less">
.assets-deposit {
  padding: 20px 0;

  .bank-info {
    &-box {
      line-height: 30px;
      font-size: 14px;
    }

    &-title {
      color: var(--color-gray);
    }
  }

  .assets-network {
    display: flex;

    button {
      margin-right: 8px;
    }

    .active {
      color: #fff;
      background-color: #40a9ff;
      border-color: #40a9ff;
    }
  }

  .address-box {
    display: flex;
    width: 556px;
    height: 36px;
    line-height: 36px;
    margin-top: 20px;

    .address-label {
      width: 106px;
      color: var(--color-gray);
    }
    .address-form {
      flex: 1 1;
      border-radius: 4px;
      border: 1px solid var(--border-color);
      position: relative;
      display: flex;
      input {
        border: 0;
        flex: 1 1;
        outline: none;
        padding: 0 10px;
        color: var(--text-default-color);
      }
      a {
        margin: 0 10px;
        position: relative;
      }
      .show-qrcode {
        cursor: default;
        display: none;
        position: absolute;
        height: 120px;
        width: 120px;
        top: 40px;
        left: 50%;
        transform: translateX(-50%);
        &.active {
          display: block;
          background: #fff;
          border: 1px solid var(--bg-downdown-border-color);
          box-shadow: 0 0px 30px 0 rgba(255, 255, 255, 0.05);
        }
        canvas {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateY(-50%) translateX(-50%);
        }
      }
    }
  }
  .block-address {
    display: block;
    text-align: right;
    width: 556px;
    line-height: 21px;
  }
}
</style>
