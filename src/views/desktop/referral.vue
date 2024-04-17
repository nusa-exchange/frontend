<template>
  <div class="ant-layout-content page-referral">
    <div class="container">
      <Dashboard />
      <CommissionsTable />
    </div>
  </div>
</template>

<script lang="ts">
import Dashboard from "@/layouts/desktop/referral/Dashboard.vue";
import CommissionsTable from "@/layouts/desktop/referral/CommissionsTable.vue";
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    Dashboard,
    CommissionsTable
  }
})
export default class Referral extends Vue {
  
}
</script>

<style lang="less">
.page-referral {
  &-dashboard {
    margin-top: 24px;

    &-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-period {
      display: inline-block;
      font-size: 16px;

      &-item {
        margin-right: 12px;

        &-selected {
          color: var(--disabled-color);
        }
      }
    }

    &-content {
      position: relative;
      background-color: var(--bg-card-color);
      margin-top: 20px;
      padding: 24px;
      display: flex;

      > * {
        flex: 1;
      }

      .title {
        font-size: 18px;
        color: var(--color-gray);
      }

      .value {
        font-size: 24px;
      }
    }

    &-link {
      display: flex;
      // height: 40px;
      // line-height: 40px;
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      border-radius: 18px;
      font-size: 14px;
    }
  }

  &-commissions {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
