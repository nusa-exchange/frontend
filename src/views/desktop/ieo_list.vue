<template>
  <z-content class="page-ieo-list">
    <IEOList :list="ieo_list" />
  </z-content>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    IEOList: () => import("@/layouts/desktop/ieo/list.vue")
  }
})
export default class PageIEO extends Vue {
  ieo_list = [];

  mounted() {
    this.get_ieo_list();
  }

  async get_ieo_list() {
    try {
      const { data } = await this.TradeController.fetch_ieo_list();
      this.ieo_list = data;
    } catch (error) {
      return error;
    }
  }
}
</script>
