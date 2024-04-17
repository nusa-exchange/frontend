<template>
  <div
    :class="[
      isAction ? 'z-auth-input-suffix-action' : 'z-auth-input-suffix',
      { 'z-auth-input-suffix-action-disabled': isAction && disabled }
    ]"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AuthInputSuffix extends Vue {
  @Prop({ default: false }) readonly isAction!: boolean;
  @Prop({ default: false }) readonly disabled: boolean;
}
</script>
