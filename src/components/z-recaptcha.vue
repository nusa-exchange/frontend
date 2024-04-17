<template>
  <vue-recaptcha :sitekey="siteKey" class="z-recaptcha" @verify="onVerify" @expired="onExpired" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import config from "@/config";
import VueRecaptcha from 'vue-recaptcha';

@Component({
  components: {
    "vue-recaptcha": VueRecaptcha,
  }
})
export default class ZRecaptcha extends Vue {
  siteKey = config.recaptcha.sitekey;

  onVerify(response: string) {
    this.$emit("verify", response);
  }

  onExpired() {
    this.$emit("expired");
  }
}
</script>
