<template>
  <div class="page-ieo-list container">
    <IEOItem v-for="(ieo, index) in list" :key="index" :ieo="ieo" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    IEOItem!: () => import("./item.vue")
  }
})
export default class List extends Vue {
  @Prop() readonly list!: ZTypes.IEO[];
}
</script>

<style lang="less">
.page-ieo-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin-top: 50px;
}
</style>
