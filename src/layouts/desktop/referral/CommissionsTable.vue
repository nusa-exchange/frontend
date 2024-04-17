<template>
  <z-card class="page-referral-commissions">
    <z-table
      :columns="COLUMN"
      :loading="loading"
      :pagination="true"
      :scroll="false"
      :hover="true"
      :page="page"
      :page-size="limit"
      :data="commissions"
      @change-pagination="get_commissions"
    >
      <template slot="earned_amount" slot-scope="{ column, item }">
        <span
          :class="[
            'price',
            `text-${column.algin}`,
          ]"
        >
          {{ Number(item.earned_amount).toFixed(8) }} {{ item.currency_id.toUpperCase() }}
        </span>
      </template>
    </z-table>
  </z-card>
</template>

<script lang="ts">
import ApiClient from '@/library/z-apiclient';
import moment from 'moment';
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class CommissionsTable extends Vue {
  loading = false;
  page = 1;
  limit = 15;
  data = Array<ZTypes.Commission>();

  COLUMN = [
    {
      title: "Friend's UID",
      key: "friend_uid",
      algin: "left"
    },
    {
      title: "Commission Earned",
      key: "earned_amount",
      algin: "left",
      scopedSlots: true
    },
    {
      title: "Friend's Trade Date",
      key: "created_at",
      algin: "right"
    },
    {
      title: "Commission Time",
      key: "parent_created_at",
      algin: "right"
    }
  ];

  get commissions() {
    return this.data.map(commission => {
      (commission as any).created_at = moment(commission.created_at).format("YYYY-MM-DD hh:mm:ss");
      (commission as any).parent_created_at = moment(commission.parent_created_at).format("YYYY-MM-DD hh:mm:ss");

      return commission
    })
  }

  mounted() {
    this.get_commissions();
  }

  async get_commissions(payload = { page: this.page, limit: this.limit }) {
    this.loading = true;

    try {
      const { headers, data } = await new ApiClient("finex").get("referral/commissions", payload);
      this.page = Number(headers["page"]);
      this.data = data;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="less">
.page-referral-commissions {
  .z-table {
    &-head {
      font-size: 14px;
    }

    &-row {
      height: 45px;
      line-height: 45px;
    }
  }
}
</style>