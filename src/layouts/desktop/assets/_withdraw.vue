<template>
  <div class="assets-withdraw">
    <div v-if="UserController.otp" class="assets-form">
      <div class="form-row">
        <span
          v-if="currency.type == 'coin'"
          :class="[
            'assets-withdraw-address-type',
            { 'assets-withdraw-address-type-active': type == 'address' }
          ]"
          @click="type = 'address'"
        >
          {{ $t("page.assets.withdraw.new_address") }}
        </span>
        <span
          :class="[
            'assets-withdraw-address-type',
            { 'assets-withdraw-address-type-active': type != 'address' }
          ]"
          @click="type = 'book'"
        >
          {{ $t("page.assets.withdraw.address_book") }}
        </span>
      </div>
      <div v-if="type == 'address'" class="form-row">
        <div class="assets-network">
          <a-button
            v-for="n in networks"
            :key="n.blockchain_key"
            :class="{ active: network.blockchain_key == n.blockchain_key }"
            type="primary"
            @click="change_network(n)"
          >{{ n.protocol }}</a-button>
        </div>
      </div>
      <div class="form-row">
        <label class="form-label">{{ $t(type == "address" ? "page.global.placeholder.address" : "page.assets.withdraw.address_book") }}</label>
        <div class="form-control">
          <input v-if="type == 'address'" v-model="address" type="text" autocomplete="off" />
          <div v-else class="address-book-box" @click="change_address_book_dropdown(!address_book_dropdown)" v-click-outside.capture="hide_address_book_dropdown">
            <z-loading v-if="loading_beneficiaries" />
            <template v-else>
              <template v-if="beneficiaries.length">
                <span class="address-book-name">
                  <span class="address-book-name-title">Name: </span>
                  {{ selected_beneficiary.name }} - ({{ get_beneficiary_network(selected_beneficiary.blockchain_key).protocol }})
                </span>
                <span class="address-book-info">
                  <span class="address-book-state">{{ selected_beneficiary.state }}</span>
                  <a-icon
                    type="info-circle"
                    theme="filled"
                    style="margin-right: 12px;"
                    @mouseover="change_address_book_box_info_hover(true)"
                    @mouseleave="change_address_book_box_info_hover(false)"
                    @click.prevent="() => false"
                  />
                  <span class="address-book-select">
                    <span>Select</span>
                    <a-icon type="down" />
                  </span>
                  <div v-if="address_book_box_info_hover" class="address-book-info-box">
                    <div>
                      <span class="address-book-name-title">Name: </span>
                      {{ selected_beneficiary.name }}
                    </div>
                    <div>
                      <span class="address-book-address-title">Address: </span>
                      <a
                        :href="currency.explorer_address.replace('#{address}', selected_beneficiary.data.address)"
                        target="blockchain-address"
                      >
                        {{ selected_beneficiary.data.address }}
                      </a>
                    </div>
                  </div>
                </span>
              </template>
              <div v-else class="empty-address-book" @click.prevent="open_modal_create_beneficiary">
                Add Address
                <a-icon type="plus" />
              </div>
            </template>
            <div v-if="address_book_dropdown" class="address-book-box-dropdown">
              <div
                v-for="(beneficiary, index) in beneficiaries"
                :key="index"
                class="address-book-box-dropdown-row"
                @click.stop="beneficiary.state == 'active' ? change_beneficiary(beneficiary) : open_modal_confirm_beneficiary(beneficiary)"
              >
                <span>
                  <div class="address-book-name-title">
                    Name:
                  </div>
                  <div>
                    {{ beneficiary.name }} - ({{ get_beneficiary_network(beneficiary.blockchain_key).protocol }})
                  </div>
                </span>
                <span class="text-right">
                  <span class="address-book-state">{{ beneficiary.state }}</span>
                  <a-icon type="close" @click.stop="delete_beneficiary(beneficiary)" />
                </span>
              </div>
              <div class="address-book-box-dropdown-row add-new" @click.stop="open_modal_create_beneficiary">
                Add Address
                <a-icon type="plus" class="text-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row">
        <label class="form-label">
          {{ $t("page.global.placeholder.amount") }}
          <p class="label-right">
            <span>
              {{ $t("page.global.table.available") }}
              <a @click="amount = available.toString()" v-text="available" />
            </span>
          </p>
        </label>
        <div class="form-control">
          <input
            v-model="amount"
            type="text"
            autocomplete="off"
            maxlength="16"
          />
          <span class="form-tag" v-text="currency.id.toUpperCase()" />
        </div>
      </div>
      <div class="form-row-container">
        <div class="form-row">
          <label class="form-label">{{ $t("page.global.placeholder.fee") }}</label>
          <div class="form-control">
            <input type="text" :value="Number(network.withdraw_fee).toFixed(8)" disabled />
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">
            {{ $t("page.global.placeholder.receive_amount") }}
          </label>
          <div class="form-control">
            <input type="text" :value="receive_amount" disabled />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="assets-2fa">
      {{ $t("warning.password.need2fa") }}
      <button @click="open_modal('2fa')" v-text="'ENABLE 2FA'" />
    </div>
    <div class="assets-action">
      <div class="assets-note">
        <h3 v-text="$t('page.assets.instructions')" />
        <fix-i18n
          tag="p"
          class="desc"
          path="page.assets.withdraw.note"
          :places="{
            currency: currency.id.toUpperCase(),
            min_withdraw_amount: network.min_withdraw_amount
          }"
        >
          <br />
        </fix-i18n>
      </div>
      <div class="action">
        <button
          v-if="UserController.otp"
          type="submit"
          :disabled="button_disabled"
          @click="withdraw()"
          v-text="$t('page.global.action.submit')"
        />
      </div>
    </div>
    <modal-2fa ref="2fa" />
    <modal-create-withdrawal ref="modal-create-withdrawal" />
    <modal-create-beneficiary ref="modal-create-beneficiary" />
    <modal-confirm-beneficiary ref="modal-confirm-beneficiary" />
  </div>
</template>

<script lang="ts">
import { runNotice } from "@/mixins";
import * as helpers from "@/library/z-helpers";
import modal_2fa from "@/layouts/desktop/account/_modal_2fa.vue";
import modal_create_withdrawal from "@/layouts/desktop/modal/modal-create-withdrawal.vue";
import modal_confirm_beneficiary from "@/layouts/desktop/modal/modal-confirm-beneficiary.vue";
import modal_create_beneficiary from "@/layouts/desktop/modal/modal-create-beneficiary.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {
    "modal-2fa": modal_2fa,
    "modal-create-beneficiary": modal_create_beneficiary,
    "modal-confirm-beneficiary": modal_confirm_beneficiary,
    "modal-create-withdrawal": modal_create_withdrawal
  }
})
export default class AssetsWithdraw extends Vue {
  $refs!: {
    "modal-2fa":  modal_2fa;
    "modal-create-beneficiary": modal_create_beneficiary;
    "modal-confirm-beneficiary": modal_confirm_beneficiary;
    "modal-create-withdrawal": modal_create_withdrawal;
  };

  @Prop() readonly available!: number;
  @Prop() readonly currency!: ZTypes.Currency;

  loading_beneficiaries = false;
  loading = false;
  address_book_box_info_hover = false;
  address_book_dropdown = false;
  selected_beneficiary?: ZTypes.Beneficiary = null;

  blockchain_key?: string = null;
  address = "";
  amount = "";
  beneficiaries: ZTypes.Beneficiary[] = [];

  get type() {
    return this.currency.type == "coin" ? "address" : "book";
  }

  get button_disabled() {
    const { address } = this;
    const amount = Number(this.amount);
    const available = Number(this.available);
    const receive_amount = Number(this.receive_amount);

    if (amount > available) return true;
    if (amount <= 0) return true;
    if (receive_amount <= 0) return true;
    if (!address && this.type == "address") return true;
    if (!this.selected_beneficiary && this.type == "book") return true;
    if (this.selected_beneficiary?.state != "active" && this.type == "book") return true;
  }

  get networks() {
    return this.currency.networks;
  }

  get network() {
    return this.networks.find(network => this.blockchain_key == network.blockchain_key);
  }

  get receive_amount() {
    return this.amount ? (Number(this.amount) - Number(this.network.withdraw_fee)).toFixed(8) : (0).toFixed(8);
  }

  created() {
    if (this.currency.type == "coin") {
      this.blockchain_key = this.currency.networks[0].blockchain_key;
    }
  }

  mounted() {
    if (!this.UserController.otp) {
      runNotice("warning", "withdraw.need2fa");
    } else {
      this.get_beneficiaries();
      this.$refs["modal-create-beneficiary"].onDelete = this.$refs["modal-confirm-beneficiary"].onDelete = (message?: string) => {
        if (message != "success") return;

        this.get_beneficiaries();
      }
    }
  }

  get_beneficiary_network(blockchain_key: string) {
    return this.networks.find(n => n.blockchain_key == blockchain_key);
  }

  change_network(network: ZTypes.Network) {
    this.blockchain_key = network.blockchain_key;
  }

  change_address_book_dropdown(show: boolean) {
    if (this.beneficiaries.length == 0) return;

    this.address_book_box_info_hover = false;
    this.address_book_dropdown = show;
  }

  hide_address_book_dropdown() {
    this.change_address_book_dropdown(false);
  }

  change_address_book_box_info_hover(hover: boolean) {
    if (this.address_book_dropdown) return;

    this.address_book_box_info_hover = hover;
  }

  async get_beneficiaries() {
    try {
      this.loading_beneficiaries = true;
      const { data } = await this.UserController.get_beneficiaries(this.currency.id);

      this.beneficiaries = data;
      if (data.length) {
        this.selected_beneficiary = this.beneficiaries.find(beneficiary => beneficiary.state == "active") || this.beneficiaries[0];
      }
    } catch (error) {
      return error;
    } finally {
      this.loading_beneficiaries = false;
    }
  }

  async delete_beneficiary(beneficiary: ZTypes.Beneficiary) {
    this.loading = true;
    await this.UserController.delete_beneficiary(beneficiary.id);
    await this.get_beneficiaries();
    this.loading = false;
  }

  change_beneficiary(beneficiary: ZTypes.Beneficiary) {
    this.address_book_dropdown = false;
    this.selected_beneficiary = beneficiary;
  }

  open_modal_confirm_beneficiary(beneficiary: ZTypes.Beneficiary) {
    this.open_modal("modal-confirm-beneficiary", beneficiary);
  }

  open_modal_create_beneficiary() {
    this.open_modal("modal-create-beneficiary", this.currency);
  }

  async withdraw() {
    this.open_modal("modal-create-withdrawal", {
      currency: this.currency,
      type: this.type,
      amount: this.amount,
      blockchain_key: this.blockchain_key,
      address: this.address,
      beneficiary: this.selected_beneficiary
    });
  }

  open_modal(modal: string, payload?: any) {
    this.$refs[modal].create(payload);
  }

  close_modal(modal: string) {
    this.$refs[modal].delete();
  }

  @Watch("amount")
  onAmountChanged(amount: string) {
    this.amount = helpers.inputOnlyNumber(amount, 8);
  }
}
</script>

<style lang="less">
.assets-withdraw {
  padding: 20px 0;

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

  &-address-type {
    font-size: 16px;
    cursor: pointer;
    margin-right: 12px;
    color: var(--color-gray);

    &-active {
      color: var(--blue-color);
    }
  }

  .address-book {
    &-box {
      display: flex;
      position: relative;
      width: 100%;
      color: #e1e7ef;
      font-size: 16px;
      border: 1px solid var(--border-color);
      padding: 0 20px;
      line-height: 45px;
      height: 45px;
      cursor: pointer;

      > * {
        flex: 1;
      }

      &-dropdown {
        position: absolute;
        top: calc(100% + 3px);
        left: 0;
        z-index: 1;
        width: 100%;
        border: 1px solid #3b4d6b;
        background-color: var(--bg-downdown-color);
        box-shadow: 0 1px 6px 0 hsl(0deg 0% 100% / 10%);
        padding: 12px 0;
        border-radius: 4px;

        &-row {
          position: relative;
          display: flex;
          width: 100%;
          height: 50px;
          padding: 0 12px;
          line-height: 1.5;
          font-size: 14px;
          align-items: center;
          cursor: pointer;

          > * {
            position: relative;
            flex: 1;
          }

          &.add-new {
            height: 35px;
          }

          &:hover {
            background-color: var(--bg-card-color);
          }

          .address-book-state {
            padding: 12px;

            & + i {
              position: absolute;
              top: 25%;
              right: 0px;
              font-size: 16px;
            }
          }
        }
      }
    }

    &-name, &-address {
      &-title {
        font-size: 14px;
        color: var(--color-gray);
      }
    }

    &-info {
      position: relative;
      margin-right: 12px;
      text-align: right;

      .anticon-info-circle:hover {
        color: var(--blue-color);
        transition: color 0.3s;
      }

      &-box {
        position: absolute;
        top: 40px;
        z-index: 1;
        left: -14px;
        width: 500px;
        background-color: var(--bg-downdown-color);
        padding: 12px;
        border-radius: 4px;
        font-size: 14px;
        line-height: 30px;

        .address-book-name-title, .address-book-address-title {
          font-size: 12px;
        }
      }
    }

    &-state {
      color: var(--blue-color);
      margin-right: 12px;
    }

    &-select {
      font-size: 14px;
      color: var(--color-gray);

      i {
        margin-left: 12px;
      }
    }
  }

  .empty-address-book {
    i {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }
  }

  i {
    font-size: 14px;
    color: var(--color-gray);
    line-height: 1;
  }
}
</style>
