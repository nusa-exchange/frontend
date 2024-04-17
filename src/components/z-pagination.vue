<template>
  <div
    :class="[
      'z-pagination',
      { 'z-pagination-loading': loading },
      { 'z-pagination-small': size == 'small' }
    ]"
  >
    <div
      :class="[
        'z-pagination-item',
        { 'z-pagination-item-disabled': current_page == 1 },
      ]"
      @click="change(current_page - 1)"
    >
      <a>
        <a-icon type="left" />
      </a>
    </div>
    <div
      v-if="current_page > 1"
      class="z-pagination-item"
      @click="change(current_page - 1)"
    >
      <a>
        {{ current_page - 1 }}
      </a>
    </div>
    <div class="z-pagination-item z-pagination-item-active">
      <a>
        {{ current_page }}
      </a>
    </div>
    <div
      v-if="countRow == pageSize"
      class="z-pagination-item"
      @click="change(current_page + 1)"
    >
      <a>
        {{ current_page + 1 }}
      </a>
    </div>
    <div
      :class="[
        'z-pagination-item',
        { 'z-pagination-item-disabled': countRow != pageSize }
      ]"
      @click="change(current_page + 1)"
    >
      <a>
        <a-icon type="right" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ZPagination extends Vue {
  @Prop({ default: "big" }) readonly size!: "big" | "small";
  @Prop() readonly loading!: boolean;
  @Prop() readonly pageSize!: number;
  @Prop() readonly value?: number;
  @Prop({ default: 1 }) readonly page?: number;
  @Prop() readonly total?: number;
  @Prop() readonly countRow?: number;

  max_prev_showing = 2;
  max_next_showing = 2;

  get current_page() {
    return this.value || this.page;
  }

  change(page) {
    if (this.loading) return;
    if (page == 0) return;

    this.$emit("input", page);
    this.$emit("change", page);
  }
}
</script>

<style lang="less">
.z-pagination {
  display: block;

  &-item {
    display: inline-block;
    width: 35px;
    height: 35px;
    color: var(--color-gray);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    text-align: center;
    line-height: 35px;
    margin: 0 4px;
    cursor: pointer;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }

    a {
      user-select: none;
      color: inherit;
    }

    &-active {
      color: var(--blue-color);
      border-color: var(--blue-color);

      a {
        color: var(--blue-color);
      }
    }
  }

  &-loading &-item,
  &-item-disabled {
    color: var(--disabled-color) !important;
    border-color: var(--disabled-color) !important;
    cursor: not-allowed;
  }

  &-small &-item {
    width: 30px;
    height: 30px;
    margin: 0 2px;
    border: none;
  }
}
</style>
