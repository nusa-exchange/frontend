<template>
  <div class="page-home-m-head">
    <div
      class="page-home-m-head-action page-home-m-head-action-user"
      @click="onActionClick('user')"
    >
      <img src="@/assets/img/avatar.png" />
    </div>
    <div
      class="page-home-m-head-action page-home-m-head-action-search"
      @click="onActionClick('search')"
    >
      <a-icon type="search" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class HomePageHeadBar extends Vue {
  onActionClick(type: string) {
    this.$emit(`${type}-click`);
  }
}
</script>
