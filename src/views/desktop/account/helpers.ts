import { Vue, Component } from "vue-property-decorator";

@Component
export default class Helpers extends Vue {
  $refs!: {
    [key: string]: any;
  }

  onClick(evt) {
    if (typeof evt === "string") {
      this.$refs[evt].create();
    } else {
      evt();
    }
  }
};
