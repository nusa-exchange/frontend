import { Vue, Component } from "vue-property-decorator";

@Component
export class DocumentMixins extends Vue {
  loading = false;
  doc_type = "Passport";
  doc_number = "";
  front_upload_data?: string | ArrayBuffer = null;
  back_upload_data?: string | ArrayBuffer = null;
  in_hand_upload_data?: string | ArrayBuffer = null;
  front_upload?: File;
  back_upload?: File;
  in_hand_upload: File;

  TYPES = ['Passport', 'Identity card', 'Driver license', 'Utility Bill'];

  get button_disabled() {
    if (!this.doc_type) return true;
    if (!this.doc_number) return true;
    if (!this.front_upload_data) return true;
    if (!this.back_upload_data) return true;
    if (!this.in_hand_upload_data) return true;
    if (this.loading) return true;

    return false;
  }

  onFileChange($event: Event, type: "front" | "back" | "in_hand") {
    const files = ($event.target as any).files as File[];
    if (!["front", "back", "in_hand"].includes(type)) return;
    if (!files.length) return;
    const file = files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    this[`${type}_upload`] = file;
    reader.onload = e => (this[`${type}_upload_data`] = e.target.result);
  }

  async onSubmit() {
    this.UserController.update_document(
      this.doc_type,
      this.doc_number,
      this.front_upload,
      this.back_upload,
      this.in_hand_upload
    );
  }
}