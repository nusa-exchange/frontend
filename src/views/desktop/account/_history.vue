<template>
  <div class="setting-main history">
    <div class="setting-head">
      {{ translation("title") }}
    </div>
    <div class="setting-body">
      <table class="table table-head">
        <thead>
          <th class="text-left" v-text="$t('page.global.table.date')" />
          <th class="text-center" v-text="$t('page.global.table.ip_address')" />
          <th class="text-right" v-text="$t('page.global.table.status')" />
        </thead>
      </table>
      <div class="table-content">
        <table class="table">
          <tbody>
            <tr
              v-for="(data, index) in activity"
              :key="index"
              class="history-row"
            >
              <td class="text-left" v-text="getDate(data.created_at)" />
              <td class="text-center" v-text="data.user_ip" />
              <td class="text-right">
                {{ translation(`history.${data.action}`) }}
                {{ translation(`history.result.${data.result}`) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <a-spin v-if="loading" size="large">
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
      <a-pagination
        size="small"
        :current="page"
        :page-size="limit"
        :total="total"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@/library/z-helpers";
import UserController from "@/controllers/user";

@Component
export default class AccountHistory extends Vue {
  loading = false;
  page = 1;
  limit = 25;
  activity: ZTypes.Activity[] = [];
  total = 0;

  mounted() {
    this.get_activity();
  }

  async get_activity(page = this.page, limit = this.limit) {
    this.loading = true;
    try {
      const { data, headers } = await UserController.get_activity(
        "session",
        "login",
        page,
        limit
      );
      this.activity = data;
      this.total = headers.total;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
      this.page = page;
      this.limit = limit;
    }
  }

  onPageChange(page) {
    this.get_activity(page, 25);
  }

  getDate(date: Date) {
    return helpers.getDate(date, true);
  }

  translation(message: string, data?: {}) {
    return helpers.translation("page.account.login_history." + message, data);
  }
}
</script>
