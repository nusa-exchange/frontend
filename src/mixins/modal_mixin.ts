import * as helpers from "@/library/z-helpers";
import { Component, Vue } from "vue-property-decorator";

@Component
export class ModalMixin extends Vue {
  loading = false;
  modal_enabled = false;
  onCreate?(payload?: any): void;
  onDelete?(payload?: any): void;

  create(payload?: any) {
    this.modal_enabled = true;
    if (typeof this.onCreate === "function") {
      this.onCreate(payload);
    }
  }

  delete(payload?: any) {
    this.modal_enabled = false;
    if (typeof this.onDelete === "function") {
      this.onDelete(payload);
    }
  }

  translation(message, data = {}) {
    return helpers.translation("modal." + message, data);
  }

  closeModal() {
    this.delete();
  }

  changeModal(modal: string) {
    this.delete();
    this.$nextTick(() => {
      this.$emit("change-modal", modal);
    });
  }
}
