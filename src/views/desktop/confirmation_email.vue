<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <form
          class="confirm-email"
          @submit.prevent="confirm_email(confirmation_code)"
        >
          <h3 class="title">
            {{ $t("page.auth.confirmation_email.title") }}
          </h3>
          <div class="desc">
            {{ $t("page.auth.confirmation_email.desc", { email: UserController.email }) }}
          </div>

          <auth-input
            v-model="confirmation_code"
            name="confirmation_code"
            :placeholder="$t('page.global.placeholder.e-confirmation_code')"
            :placeholder-need="true"
            style="margin-top: 20px; margin-bottom: 8px;"
            maxlength="6"
          >
            <template slot="right-action">
              <button :disabled="cooldown > 0" @click.prevent="resend_email">
                <span v-if="this.loading_resend">
                  {{ $t("page.global.action.sending") }}
                </span>
                <span v-else>{{ this.cooldown ? $t("page.global.action.resend") : $t("page.global.action.send_code") }}</span>
                <span v-if="cooldown">({{ cooldown }})</span>
              </button>
            </template>
          </auth-input>
          <auth-button
            type="submit"
            :loading="loading"
            :disabled="confirmation_code.length < 6"
          >
            {{ $t("page.global.action.submit") }}
          </auth-button>

          <div class="not-receive-note">
            <h3>{{ $t("page.auth.confirmation_email.note.title") }}</h3>
            <ul v-html="$t('page.auth.confirmation_email.note.desc', { nameEX: nameEX, url: '#' })" />
          </div>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { UserController } from "@/controllers";
import { ConfirmationMixin } from "@/mixins";
import config from "@/config";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class ConfirmationEmail extends Mixins(ConfirmationMixin) {
  loading = false;

  get nameEX() {
    return config.nameEX;
  }

  get sended() {
    return UserController.session.sended_email;
  }

  set sended(value: boolean) {
    UserController.session.sended_email = value;
  }

  async resend_email() {
    this.loading_resend = true;

    await UserController.resend_email(
      UserController.email,
      this.start_cooldown
    );

    this.loading_resend = false;
  }

  async confirm_email() {
    this.loading = true;
    await UserController.confirm_email(this.confirmation_code, () => {
      this.$router.push("/account/security");
    });
    this.loading = false;
  }
}
</script>
