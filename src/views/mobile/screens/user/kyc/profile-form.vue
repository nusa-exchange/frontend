<template>
  <form class="kyc-screen-profile-form kyc-form" @submit.prevent="onSubmit">
    <div class="flex-row">
      <auth-input v-model="first_name" type="text" title="First Name" />
      <auth-input v-model="last_name" type="text" title="Last Name" />
    </div>
    <auth-input type="fake" title="Birthday" placeholder="Select your birthday" :value="birthday" @click="showBirthdayPicker" />
    <auth-input
      type="select"
      title="Country"
      placeholder="Select Country"
      :value="country_name"
      :list="countries()"
      :filter_keys="['name']"
      list_key="name"
      @change="onCountryChange"
    />
    <auth-input v-model="address" type="text" title="Address" />
    <div class="flex-row">
      <auth-input v-model="postcode" type="text" title="Postcode" />
      <auth-input v-model="city" type="text" title="City" />
    </div>

    <auth-button type="submit" :disabled="button_disabled" :loading="loading">
      Submit
    </auth-button>
  </form>
</template>

<script lang="ts">
import CountriesList from "countries-list";
import { DatePicker } from "cube-ui";
import { Vue, Component } from 'vue-property-decorator'
import Moment from "moment";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button")
  }
})
export default class ProfileForm extends Vue {
  loading = false;
  first_name = "";
  last_name = "";
  country = "US";
  address = "";
  postcode = "";
  city = "";
  dob?: string = null;
  birthday_picker?: DatePicker = null;

  get button_disabled() {
    if (!this.first_name) return true;
    if (!this.last_name) return true;
    if (!this.country) return true;
    if (!this.address) return true;
    if (!this.postcode) return true;
    if (!this.city) return true;
    if (!this.dob) return true;
    if (this.loading) return true;

    return false;
  }

  get birthday() {
    if (!this.dob) return;

    return Moment(this.dob).format("L");
  }

  countries() {
    return CountriesList.countries;
  }

  showBirthdayPicker() {
    if (!this.birthday_picker) {
      this.birthday_picker = this.$createDatePicker({
        title: "Choose your birthday",
        min: new Date(1970, 1, 1),
        max: new Date(),
        value: new Date(),
        columnOrder: ["date", "month", "year"],
        onSelect: (date: Date) => {
          this.dob = date.toISOString();
        },
        cancelTxt: "Cancel",
        confirmTxt: "Confirm"
      });
    }

    this.birthday_picker.show();
  }

  get country_name() {
    return CountriesList.countries[this.country].name;
  }

  onCountryChange(country_code: string) {
    this.country = country_code;
  }

  async onSubmit() {
    this.loading = true;
    await this.UserController.update_profile(
      this.first_name,
      this.last_name,
      this.dob,
      this.address,
      this.postcode,
      this.city,
      this.country
    )
    this.loading = false;
  }
}
</script>

<style lang="less">

</style>