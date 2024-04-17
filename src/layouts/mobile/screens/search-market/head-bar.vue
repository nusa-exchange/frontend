<template>
  <div class="search-markets-head">
    <div class="search-markets-head-input">
      <a-icon type="search" />
      <input
        type="text"
        :value="value"
        placeholder="Search"
        @input="$emit('input', $event.target.value)"
      />
      <a-icon v-if="value.length" type="close" />
    </div>
    <span class="search-markets-head-action" @click="$emit('cancel')">
      Cancel
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SearchMarketScreenHeadBar extends Vue {
  @Prop() readonly value!: string;
}
</script>
