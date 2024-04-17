<template>
  <div class="form-row">
    <label class="form-label">{{ label }}：</label>
    <div class="form-control">
      <auto-complete
        v-if="type === 'select'"
        :rows="rows"
        :value="value"
        type="big"
        @input="onInputChange"
      />
      <input
        v-else
        type="text"
        :value="value"
        :placeholder="placeholder"
        @input="$event => onInputChange($event.target.value)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "auto-complete": () => import("@/components/desktop/AutoComplete.vue")
  }
})
export default class AccountKYCFormRow extends Vue {
  @Prop() readonly label!: string;
  @Prop() readonly type!: "select" | "input";
  @Prop() readonly rows!: any[];
  @Prop() readonly value!: string;
  @Prop() readonly placeholder!: string;

  onInputChange(value: string) {
    this.$emit("input", value);
  }
}
</script>
