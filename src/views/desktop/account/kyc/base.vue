<template>
  <div class="setting-main kyc">
    <div class="setting-head">
      KYC Account verification
    </div>

    <a-steps :current="step" size="small">
      <a-step :title="translation('steps.basic_verification')">
        <a-icon
          v-if="
            profile_label.value == 'pending' ||
              profile_label.value == 'submitted'
          "
          slot="icon"
          type="loading"
        />
        <a-icon v-else slot="icon" type="user" />
      </a-step>
      <a-step :title="translation('steps.id_and_face_verification')">
        <a-icon
          v-if="document_label.value == 'pending'"
          slot="icon"
          type="loading"
        />
        <a-icon v-else slot="icon" type="solution" />
      </a-step>
      <a-step :title="translation('steps.done')">
        <a-icon slot="icon" type="smile-o" />
      </a-step>
    </a-steps>

    <div class="setting-body">
      <profile-form
        v-if="!profile_label.value || profile_label.value == 'rejected'"
      />
      <div class="kyc-loading" v-else-if="
          profile_label.value == 'pending' || profile_label.value == 'submitted'
        "
      >
        <div>
          <a-icon type="loading" />
        </div>
        <div class="title">
          {{ $t("page.account.kyc_account_verification.document_pending") }}
        </div>
      </div>
      <document-form
        v-else-if="!document_label.value || document_label.value == 'rejected'"
      />
      <div class="kyc-loading" v-else-if="document_label.value == 'pending'">
        <div>
          <a-icon type="loading" />
        </div>
        <div class="title">
          {{ $t("page.account.kyc_account_verification.document_pending") }}
        </div>
      </div>
      <div class="kyc-done" v-else-if="document_label.value == 'verified'">
        <div>
          <a-icon type="safety-certificate" />
        </div>
        <div class="title">
          {{ $t("page.account.kyc_account_verification.successfully") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Vue, Component } from "vue-property-decorator";
import { UserController } from "@/controllers";

@Component({
  components: {
    "profile-form": () => import("./profile-form.vue"),
    "document-form": () => import("./document-form.vue")
  }
})
export default class AccountKYC extends Vue {
  get step() {
    const profile_state = (this.profile_label as ZTypes.UserLabel)?.value;
    const document_state = (this.document_label as ZTypes.UserLabel)?.value;

    if (document_state == "verified" && profile_state == "verified") {
      return 2;
    } else if (profile_state == "verified") {
      return 1;
    } else {
      return 0;
    }
  }

  get profile_label() {
    return UserController.labels.find(label => label.key === "profile") || {};
  }

  get document_label() {
    return UserController.labels.find(label => label.key === "document") || {};
  }

  translation(message: string, data?: {}) {
    return helpers.translation("page.account.kyc_account_verification." + message, data);
  }
}
</script>

<style lang="less">
.document-list {
  &-row {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border-color);

    .list-label {
      display: block;
      flex-basis: 185px;
      color: var(--color-gray);
    }
    .list-content {
      flex: 1 1;
    }
  }
}

.kyc {
  .ant-steps {
    margin: 12px auto 24px;
    width: 600px;
  }

  button {
    margin-top: 24px;
  }

  .form-control .ant-calendar-picker {
    input {
      background-color: rgba(0, 0, 0, 0.15);

      &::placeholder {
        color: var(--color-gray);
      }
    }

    i {
      color: var(--color-gray);
    }
  }

  .kyc-loading,
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
}
</style>
