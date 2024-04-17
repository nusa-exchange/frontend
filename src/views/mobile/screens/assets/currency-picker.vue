<template>
  <panel-view class="screen-assets-search assets-search currency-picker">
    <div class="assets-search-input">
      <div class="assets-search-input-prefix">
        <a-icon type="search" />
      </div>
      <input v-model="search" type="text" placeholder="Search coin" />
      <div class="assets-search-input-cancel" @click="destroy">
        Cancel
      </div>
    </div>

    <div class="z-table">
      <div class="z-table-content">
        <div
          v-for="currency in currencies"
          :key="currency.id"
          class="z-table-row"
          @click="on_table_click(type, currency)"
        >
          <span class="logo">
            <span class="logo-content">
              <img :src="currency.icon_url" />
            </span>
          </span>
          <span class="code">
            {{ currency.id.toUpperCase() }}
          </span>
          <span class="name">{{ currency.name }}</span>
        </div>
      </div>
    </div>
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Mixins, Component } from "vue-property-decorator";
import { PublicController } from "@/controllers";

@Component
export default class CurrencyPickerScreen extends Mixins(ScreenMixin) {
  type!: string;

  search = "";

  get currencies() {
    return PublicController.currencies.filter(currency =>
      currency.id.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  panel_created(type: string) {
    const screen_preview = (this.$parent as any).$refs["screen-assets-preview"];

    this.type = type;
    if (screen_preview.isActive) screen_preview.destroy();
  }

  on_table_click(type: string, currency: ZTypes.Currency) {
    this.$emit("click", type, currency);
    this.$nextTick(() => {
      this.destroy();
    });
  }
}
</script>

<style lang="less">
@z-table-row-height: ~"40px";

.assets-search {
  background-color: var(--bg-card-color);

  &-input {
    display: flex;
    position: relative;
    justify-content: space-between;
    line-height: 32px;

    &-prefix {
      color: var(--color-gray);
      margin-left: 8px;
      font-size: 14px;
    }

    input {
      padding: 0 4px;
      font-size: 10px;
      width: 100%;

      &::placeholder {
        font-size: 10px;
        color: var(--color-gray);
      }
    }

    &-cancel {
      margin-right: 8px;
      font-size: 12px;
    }
  }

  .z-table {
    &-content {
      height: 100%;
    }

    &-row {
      height: @z-table-row-height;
      line-height: @z-table-row-height;
      padding: 0 8px;

      > * {
        flex: none;
      }
    }

    .logo {
      position: relative;
      height: @z-table-row-height;
      width: 24px;
      text-align: center;
      margin-right: 8px;

      &-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        height: 24px;
        width: 24px;
        background-color: var(--border-color);
        border-radius: 24px;
        display: block;

        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          height: 16px;
          width: 16px;
        }
      }
    }

    .code {
      font-size: 12px;
      margin-right: 8px;
    }

    .name {
      font-size: 8px;
      color: var(--color-gray);
    }
  }
}
</style>
