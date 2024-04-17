import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "z-pull": () => import("@/components/mobile/z-pull")
  }
})
export class PullMixin extends Vue {
  loading = false;
  page = 0;
  pageSize = 15;
  noMore = false;
  data = [];

  async mounted() {
    this.data = await this["fetch_data"](1, 15);
    this.noMore = this.data.length < 15;
    (this.$refs["pull"] as any).forceUpdate(true, this.noMore);
  }

  async onPullingDown(forceUpdate: (dirty: boolean, nomore: boolean) => void) {
    const data = await this["fetch_data"](1, 15);
    this.data = data;

    this.noMore = data.length < this.pageSize;
    forceUpdate(true, this.noMore);
  }

  async onPullingUp(forceUpdate: (dirty: boolean, nomore: boolean) => void) {
    const data = await this["fetch_data"](this.page + 1, 15);
    this.data = [...this.data, ...data];

    this.noMore = data.length < this.pageSize;
    forceUpdate(!!data.length, this.noMore);
  }
}
