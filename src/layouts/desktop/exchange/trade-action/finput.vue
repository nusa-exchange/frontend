<template>
  <input :value="value" @input="onInput" :maxlength="maxLength" @focus="event => $emit('focus', event)" @blur="event => $emit('blur', event)" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Finput extends Vue {
  @Prop() readonly value!: string;
  @Prop() readonly maxLength!: number;

  onInput(event) {
    if (this.maxLength > 0) {
      this.$emit('input', event.target.value.slice(0, this.maxLength))
    } else {
      this.$emit('input', event.target.value)
    }

    this.$forceUpdate()
  }
}
</script>
