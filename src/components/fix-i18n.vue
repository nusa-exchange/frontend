<template>
  <custom-tag :tag="tag">
    <template v-for="(translation) of translation_with_array">
      {{ translation }}
      <slot />
    </template>
  </custom-tag>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "custom-tag": () => import("./custom-tag.vue"),
  },
})
export default class FixI18n extends Vue {
  @Prop({ default: "p" }) public readonly tag!: string;
  @Prop() public readonly path!: string;
  @Prop() public readonly places!: { [key: string]: any; };

  get translation_with_array() {
    let translation = this.$t(this.path).toString().replace(/\n/g, "");
    for (const key in this.places) {
      translation = translation.replace(`{${key}}`, this.places[key]);
    }

    return translation.split("{0}");
  }
}
</script>
