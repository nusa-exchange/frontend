<template>
  <div
    class="depth-row"
  >
    <span v-if="side === 'bids'" class="length text-left">{{ depthSize+length+1 }}</span>
    <span v-if="side === 'bids'" class="text-left">
      --
    </span>
    <span v-if="side === 'bids'" class="text-right text-up">
      --
    </span>

    <span v-if="side === 'asks'" class="text-left text-down">
      --
    </span>
    <span v-if="side === 'asks'" class="text-right">
      --
    </span>
    <span v-if="side === 'asks'" class="length text-right">{{ depthSize+length+1 }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DepthRow extends Vue {
  @Prop() readonly side!: ZTypes.TakerType;
  @Prop() readonly length!: number;
  @Prop() readonly depthSize!: number;
}
</script>
