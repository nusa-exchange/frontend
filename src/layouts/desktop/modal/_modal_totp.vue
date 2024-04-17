<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="totp-modal"
    :footer="null"
    :width="400"
    @cancel="onMaskClick"
  >
    <div>
      <img src="@/assets/img/Google_Authenticator.png" class="logo-modal" />
      <div class="title">
        {{ translation("title") }}
      </div>
      <div class="desc">
        {{ translation("desc") }}
      </div>
      <form @submit.prevent="submit">
        <auth-input
          v-model="totp_code"
          name="totp_code"
          placeholder="2FA Code"
          :placeholder-need="true"
          maxlength="6"
          type="number"
        />
        <auth-button type="submit" :loading="loading" :disabled="totp_code.length < 6">
          {{ $t("page.global.action.confirm") }}
        </auth-button>
      </form>
    </div>
  </a-modal>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class App extends Vue {
  @Prop() private readonly payload!: any;
  @Prop() private readonly loading!: boolean;

  modal_enabled = false;
  totp_code = "";

  create() {
    this.modal_enabled = true;
  }

  delete() {
    this.modal_enabled = false;
  }

  submit() {
    this.$emit("submit", this.totp_code);
  }

  onMaskClick() {
    this.$emit("close");
  }

  translation(message, data = {}) {
    return helpers.translation("modal.totp." + message, data);
  }

  @Watch("totp_code")
  onTotpChanged(totp_code: string) {
    if (totp_code.length === 6) {
      this.submit();
    }
  }
}
</script>
