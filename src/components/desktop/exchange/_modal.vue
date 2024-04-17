<template>
  <div class="modal-exchange" :class="background">
    <div>
      <!-- <router-link
        v-for="(data, index) in BUTTON"
        :key="index"
        class="ant-btn ant-btn-primary"
        tag="button"
        :to="data.url"
        v-text="$t(data.name)"
      /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    background: String
  },
  data: () => ({
    BUTTON: [
      { name: "page.global.header.sign_in", url: "/signin" },
      { name: "page.global.header.sign_up", url: "/signup" }
    ]
  })
};
</script>
