<template>
  <div class="ant-layout-footer">
    <div class="menu-footer">
      <ul>
        <li class="title">
          <img src="@/assets/img/logo.png" />
        </li>
        <li class="l">
          <a href="#" class="icon-link">
            <i class="zicon-telegram" />
          </a>
          <a href="#" class="icon-link">
            <i class="zicon-twitter" />
          </a>
        </li>
      </ul>
      <ul>
        <li class="title">
          About Us
        </li>
        <!-- <li class="m">
          <router-link to="/disclaimer">
          Disclaimer
          </router-link>
        </li> -->
        <!-- <li class="m">
          <a>Example</a>
        </li>
        <li class="m">
          <a>Example</a>
        </li>
        <li class="m">
          <a>Example</a>
        </li> -->
      <!-- </ul>
      <ul>
        <li class="title">
          Example
        </li>
        <li class="m">
          <a>Example</a>
        </li>
        <li class="m">
          <a>Example</a>
        </li>
        <li class="m">
          <a>Example</a>
        </li>
        <li class="m">
          <a>Example</a>
        </li> -->
      </ul>
      <ul class="contact">
        <li class="title">
          Contact Us
        </li>
        <li class="m" v-text="`Service: ${contactus.service}`" />
        <li class="m" v-text="`Business: ${contactus.business}`" />
        <li class="m">
          Facebook: <a href="#">Nusa Exchange</a>
        </li>
      </ul>
    </div>
    <div class="bottom-footer">
      &copy; 2022-2024
      <a :href="copyright.link" target="_blank" v-text="copyright.name" />. All
      rights reserved. <router-link to="/disclaimer">
          Disclaimer
          </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class App extends Vue {
  public contactus = {
     service: "service@nusatech.id",
    business: "business@nusatech.id",
    facebook: "https://fb.com/nusatech"
  };

  public copyright = {
    name: "Nusa Exchange",
    link: "https://www.nusatech.id/"
  };
}
</script>
