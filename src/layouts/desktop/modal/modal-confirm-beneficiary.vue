<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-confirm-beneficiary"
    :footer="null"
    :width="400"
  >
    <a-icon type="ellipsis" class="logo-modal" />
    <div class="title">Confirm Address Book</div>

    <form @submit.prevent="confirm_beneficiary">
      <auth-input
        v-model="pin"
        name="confirmation_code"
        :placeholder="$t('page.global.placeholder.confirmation_code')"
        :placeholder-need="true"
        maxlength="6"
        type="number"
      >
        <template slot="right-action">
          <button :disabled="cooldown > 0" @click.prevent="resend_code">
            <template v-if="cooldown > 0">Resend({{ cooldown }})</template>
            <template v-else>
              Send code
            </template>
          </button>
        </template>
      </auth-input>

      <auth-button
        type="submit"
        :loading="loading"
        :disabled="pin.length < 6"
      >
        {{ $t("page.global.action.confirm") }}
      </auth-button>
    </form>
  </a-modal>
</template>

<script lang="ts">
import { ConfirmationMixin, ModalMixin } from '@/mixins';
import { Component, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class ModalConfirmBeneficiary extends Mixins(ModalMixin, ConfirmationMixin) {
  beneficiary?: ZTypes.Beneficiary = null;
  pin = "";

  onCreate(beneficiary: ZTypes.Beneficiary) {
    this.beneficiary = beneficiary;
  }

  async resend_code() {
    this.loading_resend = false;
    this.UserController.resend_pin_beneficiary(this.beneficiary.id, () => {
      this.start_cooldown();
    });
    this.loading_resend = false;
  }

  async confirm_beneficiary() {
    this.loading = true;
    await this.UserController.confirm_beneficiary(this.beneficiary.id, Number(this.pin), () => {
      this.delete("success");
    });
    this.loading = false;
  }
}
</script>

<style lang="scss">

</style>