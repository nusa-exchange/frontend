<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CustomTag extends Vue {
  @Prop() public readonly tag!: string;

  public render(createElement) {
    return createElement(this.tag, this.$slots.default);
  }
}
</script>