<template>
  <div class="z-step">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="z-step-item"
      :class="[{ 'z-step-item-active': step.done }]"
    >
      <div class="z-step-item-icon">
        <a-icon type="loading" v-if="step.loading" />
        <span v-else>{{ index + 1 }}</span>
      </div>
      <div class="z-step-item-content">
        <span>{{ step.text }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface Step {
  text: string;
  done: boolean;
  loading: boolean;
}

@Component
export default class ZStep extends Vue {
  @Prop() readonly steps!: Step[];
}
</script>

<style lang="less">
.z-step {
  display: flex;
  height: 35px;

  &-item {
    flex: 1;
    position: relative;
    text-align: center;
    color: var(--color-gray);

    &-icon {
      position: relative;
      width: 17px;
      height: 17px;
      margin: auto;
      border: 1px solid;
      border-radius: 17px;
      font-size: 9px;
      font-weight: 500;
      background-color: var(--bg-card-color);

      > span {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }

    &-icon {
      display: block;
    }

    &-content {
      position: relative;
      font-size: 8px;
      font-weight: 500;
      width: 50%;
      height: 100%;
      margin: 0 auto;

      span {
        position: absolute;
        left: 0;
        width: 100%;
        word-break: break-word;
        line-height: 10px;
      }
    }

    &-active {
      color: var(--blue-color);

      .z-step-item-icon {
        background-color: var(--blue-color);
        color: var(--bg-card-color);
        border-color: var(--blue-color);
      }
    }

    &:not(:last-child):before {
      content: "";
      position: absolute;
      top: 16px / 2;
      left: 50%;
      width: calc(100% - 16px);
      margin-left: 16px / 2;
      display: block;
      border-bottom: 1px dashed var(--color-gray);
      z-index: 0;
    }
  }
}
</style>
