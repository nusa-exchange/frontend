<template>
  <panel-view class="kyc-screen">
    <head-bar title="KYC" @back="destroy" />
    <z-step :steps="KYCStep" />

    <div class="kyc-screen-content">
      <profile-form v-if="!profile_label || profile_label.value == 'rejected'" />
      <document-form v-else-if="!document_label || document_label.value == 'rejected'" />
      <div class="kyc-done kyc-form" v-else-if="document_label.value == 'verified'">
        <div>
          <a-icon type="safety-certificate" />
        </div>
        <div class="title">
          KYC Successfully
        </div>
      </div>
      <z-loading v-else />
    </div>
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "z-step": () => import("@/components/mobile/z-step.vue"),
    "profile-form": () => import("./profile-form.vue"),
    "document-form": () => import("./document-form.vue")
  }
})
export default class KYCScreen extends Mixins(ScreenMixin) {
  get KYCStep() {
    return [
      {
        text: "Basic verification",
        done: true,
        loading: ["pending", "submitted"].includes(this.profile_label?.value)
      },
      {
        text: "ID Face verification",
        done: this.profile_label?.value == "verified",
        loading: ["pending", "submitted"].includes(this.document_label?.value)
      },
      {
        text: "Done",
        done: this.document_label?.value == "verified",
        loading: this.document_label?.value == "pending"
      }
    ];
  }

  get profile_label() {
    return this.UserController.labels.find(label => label.key == "profile");
  }

  get document_label() {
    return this.UserController.labels.find(label => label.key == "document");
  }
}
</script>

<style lang="less">
.kyc-form {
  padding: 12px 12px 0 12px;

  .flex-row {
    display: flex;

    > * {
      flex: 1;
      padding: 0 8px;

      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
      }
    }
  }

  .z-auth-input {
    margin-top: 4px;
  }

  button {
    position: absolute;
    width: calc(100% - 12px * 2);
    left: 12px;
    bottom: 12px;
  }
}

.kyc-screen {
  &-content {
    position: relative;
    height: calc(100% - 35px - 35px);
  }
}

.kyc-done {
  padding-top: 120px;
  text-align: center;

  i {
    font-size: 300px;
    color: var(--blue-color);
  }

  .title {
    color: var(--color-gray);
    font-size: 24px;
    font-weight: 500;
    margin-top: 24px;
  }
}
</style>
