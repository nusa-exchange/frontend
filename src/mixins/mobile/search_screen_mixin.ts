import SearchScreen from "@/views/mobile/screens/search";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    "search-screen": SearchScreen
  }
})
export class SearchScreenMixin extends Vue {
  before_panel_create?(payload?: any): void;
  panel_created?(payload?: any): void;
  before_panel_destroy?(payload?: any): void;
  panel_destroyed?(payload?: any): void;

  private SearchScreen!: {
    isActive: boolean;
  };

  private get isActive(): boolean {
    if (!this.SearchScreen) return false;

    return this.SearchScreen.isActive;
  }

  private set isActive(value: boolean) {
    if (!this.SearchScreen) return;

    this.SearchScreen.isActive = value;
  }

  create(payload?) {
    if (!this.SearchScreen) throw "SearchScreen is not ready";
    if (typeof this.before_panel_create === "function") {
      this.before_panel_create(payload);
    }

    this.isActive = true;

    this.$nextTick(() => {
      if (typeof this.panel_created === "function") {
        this.panel_created(payload);
      }
    });
  }

  destroy(payload?) {
    if (!this.SearchScreen) throw "SearchScreen is not ready";

    if (typeof this.before_panel_destroy === "function") {
      this.before_panel_destroy(payload);
    }

    this.isActive = false;

    this.$nextTick(() => {
      if (typeof this.panel_destroyed === "function") {
        this.panel_destroyed(payload);
      }
    });
  }
}
