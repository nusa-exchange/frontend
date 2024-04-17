<template>
  <div>
    <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
    <div class="title">{{ translation("title") }}</div>
    <div class="desc">
      {{ translation("desc") }}
    </div>
    <div class="box">
      <p
        v-for="(data, index) in actions"
        :key="index"
        @click="actionChange(index)"
      >
        <img :src="data.logo" class="icon" />
        <span class="name">{{ data.name }}</span>
        <span class="action" :class="{ selected: selected === index }" />
      </p>
    </div>
    <auth-button
      type="submit"
      :disabled="!selected"
      @click="$emit('change-modal', selected)"
    >
      {{ $t('page.global.action.next') }}
    </auth-button>
    <div class="later-footer">
      <span @click="$emit('close-modal')">{{ $t("page.global.action.later") }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import example_action_logo from "@/assets/img/example_modal_logo.jpg";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class NeedSecurity extends Vue {
  loading = false;

  actions = {
    "2fa": {
      enabled: false,
      logo: example_action_logo,
      name: "Google Authenticator"
    }
  };
  selected = "";

  actionChange(action) {
    this.selected = action;
  }

  translation(message, data = {}) {
    return helpers.translation("modal.need_security." + message, data);
  }
}
</script>
