<template>
  <panel-view class="screen-auth confirm-email">
    <head-bar @back="destroy" />

    <div class="body-bar">
      <div class="screen-auth-box">
        <div class="screen-auth-logo" />
        <div class="screen-auth-title">
          Confirm Email
        </div>

        <auth-input
          v-model="confirmation_code"
          name="confirmation_code"
          maxlength="6"
          type="text"
          placeholder="E-mail verification code"
        >
          <template slot="suffix">
            <button
              style="padding: 0;width: 50px;font-weight: 500;"
              :disabled="this.cooldown > 0"
              @click.prevent="resend_email"
            >
              <span v-if="this.loading_resend">
                {{ $t("page.global.action.sending") }}
              </span>
              <span v-else>{{ this.cooldown ? "Resend" : "Send Code" }}</span>
              <span v-if="cooldown">({{ cooldown }})</span>
            </button>
          </template>
        </auth-input>

        <auth-button
          :loading="loading"
          :disabled="confirmation_code.length < 6"
          @click="confirm_email"
        >
          Submit
        </auth-button>
      </div>
    </div>
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { AuthMixin, ConfirmationMixin } from "@/mixins";
import { Component, Mixins, Watch } from "vue-property-decorator";
import { UserController } from "@/controllers";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button")
  }
})
export default class ScreenConfirmEmail extends Mixins(
  ScreenMixin,
  ConfirmationMixin,
  AuthMixin
) {
  loading = false;

  before_panel_destroy() {
    if (UserController.state == "pending") this.UserController.logout();
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
    await UserController.confirm_email(this.confirmation_code);
    this.loading = false;
  }

  @Watch("UserController.state")
  onUserStateChanged(state: string) {
    if (state == "active" && this.isActive) this.destroy();
  }
}
</script>
