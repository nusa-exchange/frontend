<template>
  <div
    class="z-table"
    :class="{
      'z-table-pagination': pagination,
      'z-table-borderable': border,
      'z-table-no-scroll': !scroll,
      'z-table-hoverable': hover,
      'z-table-empty': !data.length,
      'z-table-loading': loading
    }"
  >
    <div class="z-table-head">
      <template v-for="column of columns">
        <span
          :key="column.key"
          :class="[
            column.class_name || column.key,
            {
              'z-table-sort': column.sorter,
              'z-table-sort-selected': column.sorter && sort_by === column.key
            },
            `text-${column.algin}`
          ]"
          @click="change_sort(column.key)"
        >
          <span>{{ column.title }}</span>
          <span
            v-if="column.sorter"
            :class="[
              'z-table-sort-column',
              {
                'z-table-sort-reverse': sort_by === column.key && sort_reverse
              }
            ]"
          >
            <i class="zicon-caret-up" />
            <i class="zicon-caret-down" />
          </span>
        </span>
      </template>
    </div>
    <div class="z-table-content">
      <a-spin v-if="loading" class="z-table-loading-wrapper">
        <a-icon slot="indicator" type="loading" spin />
      </a-spin>
      <z-empty v-else-if="!data.length && !noEmpty" />
      <template v-for="(item, index) in data_with_sort">
        <p
          :class="[
            'z-table-row',
            { 'z-table-row-selected': item[selected.key] === selected.value }
          ]"
          :key="index"
          @click="onClick(item)"
        >
          <slot
            v-if="customTag"
            name="tag"
            :item="item"
          />
          <template v-else v-for="column of columns">
            <slot
              v-if="column.scopedSlots"
              :name="column.key"
              :item="item"
              :column="column"
            />
            <span
              v-else
              :key="column.key"
              :class="[column.class_name || column.key, `text-${column.algin}`]"
              v-text="value_by_key(item, column.key)"
            />
          </template>
        </p>
      </template>
    </div>
    <z-pagination
      v-if="pagination"
      class="z-table-pagination-content text-right"
      size="small"
      :value="page"
      :loading="loading"
      :page-size="pageSize"
      :count-row="data.length"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface Column {
  title: string;
  key: string;
  class_name?: string;
  algin: "left" | "center" | "right";
  sorter?: boolean;
  scopedSlots: boolean;
}

@Component
export default class ZTable extends Vue {
  @Prop({ default: false }) public readonly loading!: boolean;
  @Prop() public readonly columns!: Column[];
  @Prop({ default: () => [] }) public readonly data!: any[];
  @Prop({ default: false }) public readonly hover!: boolean;
  @Prop({ default: true }) public readonly scroll!: boolean;
  @Prop({ default: false }) public readonly pagination!: boolean;
  @Prop() public readonly total!: number;
  @Prop() public readonly page!: number;
  @Prop() public readonly pageSize!: number;
  @Prop({ default: () => ({ key: "", value: "" }) })
  public readonly selected!: { key: string; value: string };
  @Prop({ default: false }) public readonly noEmpty!: boolean;
  @Prop({ default: true }) public readonly border!: boolean;
  @Prop() readonly customTag!: boolean;

  protected sort_by = "";
  protected sort_reverse = false;

  get data_with_sort() {
    const { data, sort_by, sort_reverse } = this;
    if (!sort_by.length) {
      return data;
    }

    const data_with_sort = data.sort((i1, i2) =>
      String(i1[sort_by]).localeCompare(String(i2[sort_by]))
    );
    if (sort_reverse) {
      data_with_sort.reverse();
    }

    return data_with_sort;
  }

  public onChange(page: number) {
    this.$emit("change-pagination", { page, limit: this.pageSize });
  }

  public onClick(item) {
    this.$emit("click", item);
  }

  public value_by_key(item: any, key: string) {
    return item[key];
  }

  public change_sort(key) {
    const column = this.columns.find(column => column.key === key);
    if (!column) {
      return;
    }
    if (this.sort_by === key && this.sort_reverse) {
      this.sort_by = "";
      this.sort_reverse = false;
      return;
    }

    this.sort_reverse = this.sort_by === key && !this.sort_reverse;
    this.sort_by = key;
  }
}
</script>

<style lang="less">
@import "~@/assets/css/components/z-table";
</style>
