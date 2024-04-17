<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-create-beneficiary"
    :footer="null"
    :width="400"
  >
    <a-icon type="import" class="logo-modal" />
    <div class="title">
      Add Withdrawal Address
    </div>
    <form @submit.prevent="create_beneficiary">
      <auth-input
        v-model="name"
        name="name"
        :placeholder="$t('page.global.placeholder.name')"
        :placeholder-need="true"
      />
      <auth-input
        v-if="currency.type == 'coin'"
        v-model="address"
        name="address"
        :placeholder="$t('page.global.placeholder.address')"
        :placeholder-need="true"
      />
      <auth-input
        v-if="currency.type == 'coin'"
        v-model="blockchain_key"
        type="select"
        name="network"
        :placeholder="$t('page.global.placeholder.network')"
        :placeholder-need="true"
        :select="
          networks.reduce((obj, network) => {
            return {
              ...obj,
              [network['blockchain_key']]: network.protocol
            };
          }, {})
        "
      />
      <template v-else>
        <auth-input
          v-model="full_name"
          name="full_name"
          :placeholder="$t('page.global.placeholder.full_name')"
          :placeholder-need="true"
        />
        <auth-input
          v-model="account_number"
          name="account_number"
          :placeholder="$t('page.global.placeholder.account_number')"
          :placeholder-need="true"
        />
        <auth-input
          v-model="bank_name"
          name="bank_name"
          :placeholder="$t('page.global.placeholder.bank_name')"
          :placeholder-need="true"
        />
        <auth-input
          v-model="bank_swift_code"
          name="bank_swift_code"
          :placeholder="$t('page.global.placeholder.bank_swift_code')"
        />
        <auth-input
          v-model="intermediary_bank_name"
          name="intermediary_bank_name"
          :placeholder="$t('page.global.placeholder.intermediary_bank_name')"
        />
        <auth-input
          v-model="intermediary_bank_swift_code"
          name="intermediary_bank_swift_code"
          :placeholder="$t('page.global.placeholder.intermediary_bank_swift_code')"
        />
      </template>

      <auth-button
        type="submit"
        :loading="loading"
        :disabled="button_disabled"
      >
        {{ $t("page.global.action.confirm") }}
      </auth-button>
    </form>
  </a-modal>
</template>

<script lang="ts">
import { ModalMixin } from '@/mixins';
import { Component, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class ModalCreateBeneficiary extends Mixins(ModalMixin) {
  currency: ZTypes.Currency | { [key: string]: string } = {};
  name = "";

  // for coin
  address = "";
  blockchain_key = "";

  // for fiat
  account_number = "";
  bank_name = "";
  bank_swift_code = "";
  full_name = "";
  intermediary_bank_name = "";
  intermediary_bank_swift_code = "";

  get networks() {
    return this.currency.networks;
  }

  get button_disabled() {
    if (!this.name) return true;
    if (this.currency.type == "coin") {
      if (!this.address) return true;
    } else {
      if (!this.full_name) return true;
      if (!this.account_number) return true;
      if (!this.bank_name) return true;
    }
  }

  onCreate(currency: ZTypes.Currency) {
    this.currency = currency;
  }

  async create_beneficiary() {
    this.loading = true;
    await this.UserController.create_beneficiary(
      this.currency.id,
      this.blockchain_key,
      this.name,
      JSON.stringify(this.currency.type == "coin" ? {
        address: this.address
      } : {
        account_number: this.account_number,
        full_name: this.full_name,
        bank_name: this.bank_name,
        bank_swift_code: this.bank_swift_code,
        intermediary_bank_name: this.intermediary_bank_name,
        intermediary_bank_swift_code: this.intermediary_bank_swift_code,
      }),
      () => {
        this.delete("success");
      }
    );
    this.loading = false;
  }
}
</script>

<style lang="less">
.modal-create-beneficiary {
  .title {
    // margin-top: 20px;
    // font-size: 20px;
  }
}
</style>
