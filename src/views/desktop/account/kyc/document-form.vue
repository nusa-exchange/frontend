<template>
  <form class="document-form" @submit.prevent="onSubmit">
    <form-row
      :label="translation('form.type.label')"
      type="select"
      :rows="TYPES"
      v-model="doc_type"
    />
    <form-row
      :label="translation('form.id_number.label')"
      type="input"
      :placeholder="translation('form.id_number.placeholder')"
      v-model="doc_number"
    />
    <div class="form-row">
      <label class="form-label">{{ translation('form.id_photo.label') }}：</label>
      <div class="form-control upload-photos">
        <ul class="photos-list">
          <li class="front">
            <div class="upload-box">
              <input
                type="file"
                accept="image/*"
                @change="onFileChange($event, 'front')"
              />
              <div v-if="front_upload_data" class="img-uploaded">
                <img :src="front_upload_data" class="preview" />
              </div>
              <div v-else class="upload-area">
                <img src="@/assets/img/action_add.png" />
                <p>{{ translation('form.id_photo.front.placeholder') }}</p>
              </div>
            </div>
            <img src="@/assets/img/kyc_example.png" class="thumbnail-box" />
            <div class="upload-notice">
              {{ translation('form.id_photo.front.desc') }}
            </div>
          </li>
          <li class="back">
            <div class="upload-box">
              <input
                type="file"
                accept="image/*"
                @change="onFileChange($event, 'back')"
              />
              <div v-if="back_upload_data" class="img-uploaded">
                <img :src="back_upload_data" class="preview" />
              </div>
              <div v-else class="upload-area">
                <img src="@/assets/img/action_add.png" />
                <p>{{ translation('form.id_photo.back.placeholder') }}</p>
              </div>
            </div>
            <img src="@/assets/img/kyc_example.png" class="thumbnail-box" />
            <div class="upload-notice">
              {{ translation('form.id_photo.back.desc') }}
            </div>
          </li>
          <li class="in-hand">
            <div class="upload-box">
              <input
                type="file"
                accept="image/*"
                @change="onFileChange($event, 'in_hand')"
              />
              <div v-if="in_hand_upload_data" class="img-uploaded">
                <img :src="in_hand_upload_data" class="preview" />
              </div>
              <div v-else class="upload-area">
                <img src="@/assets/img/action_add.png" />
                <p>{{ translation('form.id_photo.in_hand.placeholder') }}</p>
              </div>
            </div>
            <img src="@/assets/img/kyc_example.png" class="thumbnail-box" />
            <div class="upload-notice" v-html="translation('form.id_photo.in_hand.desc', { exchange_name: config.nameEX })" />
          </li>
        </ul>
      </div>
    </div>
    <div class="form-row">
      <div class="form-label" />
      <div class="form-control">
        <button type="submit" :disabled="button_disabled">
          <a-icon v-if="loading" type="loading" />
          {{ $t('page.global.action.submit') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Mixins, Component } from "vue-property-decorator";
import { DocumentMixins } from "@/mixins/kyc";

@Component({
  components: {
    "form-row": () => import("./form-row.vue"),
    "auto-complete": () => import("@/components/desktop/AutoComplete.vue"),
  }
})
export default class DocumentForm extends Mixins(DocumentMixins) {
  translation(message: string, data?: {}) {
    return helpers.translation("page.account.kyc_account_verification." + message, data);
  }
}
</script>
