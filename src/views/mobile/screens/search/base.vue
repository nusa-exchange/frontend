<template>
  <panel-view class="search-screen">
    <div class="search-screen-head">
      <div class="search-screen-head-input">
        <a-icon type="search" />
        <input
          type="text"
          :value="value"
          placeholder="Search"
          @input="$emit('input', $event.target.value)"
        />
        <a-icon v-if="value.length" type="close" />
      </div>
      <span class="search-screen-head-action" @click="destroy">
        Cancel
      </span>
    </div>
    <div v-if="!hidden" class="search-screen-content">
      <div class="z-table">
        <div v-if="headText.length" class="z-table-head">
          {{ headText }}
        </div>
        <div
          class="z-table-content"
          :style="!headText.length ? 'height: 100%;' : ''"
        >
          <div
            v-for="(item, key) in data"
            :key="key"
            class="z-table-row"
            @click="$emit('click', key, item)"
          >
            <slot :item="item" />
          </div>
        </div>
      </div>
    </div>
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Prop, Mixins } from "vue-property-decorator";

@Component
export default class SearchScreen extends Mixins(ScreenMixin) {
  @Prop() readonly value!: string;
  @Prop({ default: "" }) readonly headText!: string;
  @Prop() readonly data!: any[];
  @Prop({ default: false }) readonly hidden!: boolean;

  mounted() {
    (this.$parent as any).SearchScreen = this;
  }
}
</script>

<style lang="less">
.search-screen {
  padding: 2px 8px;
  background-color: var(--bg-card-color);

  &-head {
    position: relative;
    display: flex;
    width: 100%;
    height: 25px;
    line-height: 25px;

    &-input {
      position: relative;
      display: inline-block;
      width: 100%;
      background-color: var(--bg-color);
      border-radius: 4px;

      i {
        position: absolute;
        top: 0;
        line-height: 25px;
        font-size: 13px;
        color: var(--disabled-color);

        &.anticon-search {
          left: 8px;
        }
        &.anticon-close {
          right: 8px;
        }
      }

      input {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        padding: 0 24px;

        &::placeholder {
          font-size: 11px;
        }
      }
    }

    &-action {
      display: inline-block;
      margin-left: 4px;
      font-size: 11px;
      font-weight: 500;
    }
  }

  &-content {
    position: relative;
    height: 100%;
  }

  .z-table {
    &-head,
    &-row {
      padding: 0;
      font-weight: 500;
      line-height: 25px;
      font-size: 12px;
    }

    &-row {
      padding: 4px 0;
      border-bottom: 1px solid var(--bg-color);

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
