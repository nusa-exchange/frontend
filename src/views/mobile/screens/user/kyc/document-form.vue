<template>
  <form class="kyc-screen-document-form kyc-form" @submit.prevent="onSubmit">
    <auth-input
      v-model="doc_type"
      type="select"
      title="Type of certificate"
      :list="TYPES"
    />
    <auth-input v-model="doc_number" type="text" title="ID Number" />

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
        <p>Click to upload the front side of the ID photo</p>
      </div>
    </div>
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
        <p>Click to upload the back side of the ID photo</p>
      </div>
    </div>
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
        <p>Upload a hand-held ID photo</p>
      </div>
    </div>
    <auth-button type="submit" :disabled="button_disabled" :loading="loading">
      Submit
    </auth-button>
  </form>
</template>

<script lang="ts">
import { Mixins, Component } from "vue-property-decorator";
import { DocumentMixins } from "@/mixins/kyc";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button")
  }
})
export default class DocumentForm extends Mixins(DocumentMixins) {
}
</script>

<style lang="less">
.kyc-screen-document-form {
  .upload-box {
    width: 240px;
    height: 160px;
    position: relative;
    margin: 6px auto;

    input {
      position: absolute;
      width: 240px;
      height: 160px;
      left: 0;
      top: 0;
      outline: none;
      cursor: pointer;
      opacity: 0;
      z-index: 10002;
    }

    .img-uploaded {
      border-radius: 4px;
      width: 240px;
      height: 160px;
      position: absolute;
      z-index: 999;
      > img {
        border-radius: 6px;
      }
    }

    img {
      width: 200px;
      height: 120px;
    }
  }

  .upload-area {
    width: 240px;
    height: 160px;
    text-align: center;
    background: url("~@/assets/img/upload_img.jpg")  0 0 no-repeat;
    background-size: 100% 100%;
    color: #97b0d6;
    position: relative;
    border-radius: 6px;

    img {
      margin-top: 50px;
      width: 30px;
      height: 30px;
    }

    p {
      padding-top: 8px;
    }
  }
}
</style>
