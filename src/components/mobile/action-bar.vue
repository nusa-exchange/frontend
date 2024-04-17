<template>
  <div :class="['action-bar']">
    <div v-if="$slots['head']" class="action-bar-head">
      <div class="back">
        <i
          v-if="!leftDisabled"
          class="zicon-arrow-back1"
          @click="$emit('back')"
        />
      </div>
      <slot name="head" />
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ActionBar extends Vue {
  @Prop({ default: false }) readonly leftDisabled!: boolean;
}
</script>

<style lang="less">
.action-bar {
  background-color: var(--bg-card-color);
  position: relative;
  height: 35px;

  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 35px;
    padding: 0 8px;
  }

  i {
    font-size: 16px;
    color: var(--color-gray);
    line-height: 35px;
    vertical-align: middle;
  }

  .center-action {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    .title {
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .right-action {
    right: 8px;
    font-size: 10px;
    color: var(--color-gray);
  }

  .loading i {
    color: var(--blue-color);
  }
}
</style>
