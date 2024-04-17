<template>
  <action-bar
    class="head-bar"
    :left-disabled="leftDisabled"
    @back="$emit('back')"
  >
    <template slot="head">
      <div v-if="$slots.center" class="center-action">
        <slot name="center" />
      </div>
      <div v-else class="center-action">
        <span v-if="loading" class="title loading">
          Loading <a-icon type="loading" />
        </span>
        <span v-else class="title">{{ title }}</span>
      </div>
      <div class="right-action">
        <slot name="right" />
      </div>
    </template>
    <slot />
  </action-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "action-bar": () => import("@/components/mobile/action-bar.vue")
  }
})
export default class ActionBar extends Vue {
  @Prop() readonly title!: string;
  @Prop() readonly loading!: boolean;
  @Prop() readonly leftDisabled!: boolean;
}
</script>
