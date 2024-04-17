<template>
  <div v-if="isShowing" class="suggestion-2fa" @click="remove">
    <div class="suggestion-2fa-box" @click.stop="render()">
      <div class="suggestion-2fa-content">
        <div class="icon"></div>
        <div class="note">
          We Strongly recommend you to enable 2FA on your account! Please go to
          ZSmart
        </div>
        <div class="suggestion-2fa-item">
          <i class="zicon-gugeyanzheng" />
          <span>Google Auth</span>
        </div>
      </div>
      <div class="suggestion-2fa-action">
        <button @click.stop="remove">
          I Understand
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isShowing: false
  }),
  methods: {
    render() {
      this.isShowing = true;
    },
    remove() {
      this.isShowing = false;
    }
  }
};
</script>
