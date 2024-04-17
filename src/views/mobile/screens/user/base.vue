<template>
  <panel-view class="screen-user">
    <head-bar title="User info" @back="destroy" />
    <div class="screen-user-head">
      <div class="screen-user-head-email">
        {{ email }} <a-icon :type="hidden_email ? 'eye' : 'eye-invisible'" @click="hidden_email = !hidden_email" />
      </div>
      <div class="screen-user-head-uid">
        UID: {{ UserController.uid }} <a-icon type="copy" @click="copyUID" />
      </div>
    </div>

    <div class="screen-user-content">
      <div class="setting-list">
        <setting-row icon="security-scan" @click="open_screen('security')">
          Security
        </setting-row>
        <setting-row icon="safety-certificate" @click="open_screen('kyc')">
          KYC
        </setting-row>

        <div class="screen-user-bottom">
          <button class="logout-button" :disabled="loading" @click="logout">
            <a-icon v-if="loading" type="loading" />
            Log Out
          </button>
        </div>
      </div>
      <div class="setting-list">
        <setting-row icon="phone">
          Help & Support
        </setting-row>
        <setting-row icon="share-alt">
          Share the website
        </setting-row>
      </div>
    </div>

    <screen-security ref="screen-security" />
    <screen-kyc ref="screen-kyc" />
  </panel-view>
</template>

<script lang="ts">
import ZSmartModel from "@/library/z-eventbus";
import { copyText } from "@/library/z-helpers";
import { EncryptEmail, runNotice } from '@/mixins';
import { ScreenMixin } from '@/mixins/mobile';
import { Mixins, Component } from 'vue-property-decorator'

@Component({
  components: {
    "setting-row": () => import("@/components/mobile/setting-row"),
    "screen-security": () => import("./security"),
    "screen-kyc": () => import("./kyc")
  }
})
export default class UserScreen extends Mixins(ScreenMixin) {
  hidden_email = true;
  loading = false;

  get isAuth(): boolean {
    return this.UserController.state == "active";
  }

  get email() {
    return this.hidden_email ? EncryptEmail(this.UserController.email) : this.UserController.email;
  }

  mounted() {
    ZSmartModel.on("user/LOGOUT", () => {
      this.destroy();
    })
  }

  copyUID() {
    copyText(this.UserController.uid);
    runNotice("success", "copy");
  }

  open_screen(screen: string) {
    (this.$refs[`screen-${screen}`] as ScreenMixin).create();
  }

  async logout() {
    this.loading = true;
    await this.UserController.logout();
    this.destroy();
    this.loading = false;
  }
}
</script>

<style lang="less">
.screen-user {
  &-head {
    padding: 0 12px;

    &-email {
      line-height: 23px;
      font-size: 16px;
      font-weight: 500;

      i {
        font-size: 10px;
        color: var(--color-gray);
      }
    }

    &-uid {
      font-size: 8px;
      color: var(--color-gray);
    }
  }

  &-content {
    min-height: calc(100% - 35px - 35px);
    position: relative;
    padding-top: 20px;
    padding-bottom: 50px;

    .setting-list {
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
      }
    }

    .logout-button {
      height: 35px;
      font-weight: 500;
      font-size: 14px;
      width: 100%;
      margin: 8px 0;
      border-radius: 4px;
      background-color: var(--border-color);

      &:disabled {
        background-color: var(--disabled-color);
        cursor: not-allowed;
      }
    }
  }

  &-bottom {
    position: absolute;
    left: 12px;
    bottom: 0;
    width: calc(100% - 12px * 2);
  }
}
</style>