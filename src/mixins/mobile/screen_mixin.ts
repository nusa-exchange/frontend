import PanelView from "@/components/mobile/panel-view.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    "head-bar": () => import("@/views/mobile/modules/head-bar.vue"),
    "panel-view": PanelView,
  },
})
export class ScreenMixin extends Vue {
  before_panel_create?(payload?: any): void;
  panel_created?(payload?: any): void;
  before_panel_destroy?(payload?: any): void;
  panel_destroyed?(payload?: any): void;

  rending_time = 300;
  panel_rending = false;

  private PanelView!: {
    isActive: boolean;
  };

  get isActive() {
    if (!this.PanelView) return false;

    return this.PanelView.isActive;
  }

  set isActive(value: boolean) {
    if (!this.PanelView) return;

    this.panel_rending = true;
    this.$nextTick(() => {
      this.PanelView.isActive = value;
      this.$nextTick(() => {
        setTimeout(() => {
          this.panel_rending = false;
        }, this.rending_time);
      })
    })
  }

  get panel_ready() {
    return !this.panel_rending;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * To create screen
   *
   * @param {any} payload anything you want to add to method `before_panel_create(payload: any)` and `panel_created(payload: any)`
  **/
  create(payload?: any) {
    if (!this.PanelView || this.panel_rending) return;
    if (typeof this.before_panel_create === "function") {
      this.before_panel_create(payload);
    }
    this.$nextTick(() => {
      this.isActive = true;

      this.$nextTick(() => {
        if (typeof this.panel_created === "function") {
          setTimeout(() => {
            this.panel_created(payload);
          }, this.rending_time);
        }
      });
    });
  }

  /**
   * To destroy current screen
   *
   * @param {any} payload anything you want to add to method `panel_destroyed(payload: any)`
  **/
  destroy(payload?: any) {
    if (!this.PanelView || this.panel_rending) return;
    if (typeof this.before_panel_destroy === "function") {
      this.before_panel_destroy(payload);
    }

    this.$nextTick(() => {
      this.isActive = false;

      this.$nextTick(() => {
        if (typeof this.panel_destroyed === "function") {
          setTimeout(() => {
            this.panel_destroyed(payload);
          }, this.rending_time);
        }
      });
    });
  }
}
