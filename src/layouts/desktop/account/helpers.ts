import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {
    "need-security": () =>
      import("@/layouts/desktop/account/_need_security.vue"),
  },
})
export default class App extends Vue {
  step = 1;
  modal_enabled = false;
  public onCreate?(): void;
  public onDelete?(): void;

  public create() {
    this.modal_enabled = true;
    if (typeof this.onCreate === "function") {
      this.onCreate();
    }
  }

  public delete() {
    this.modal_enabled = false;
    if (typeof this.onDelete === "function") {
      this.onDelete();
    }
  }

  public resetStep() {
    this.step = 1;
  }

  public closeModal() {
    this.delete();
  }

  public changeModal(modal: string) {
    this.delete();
    this.$nextTick(() => {
      this.$emit("change-modal", modal);
    });
  }
}
