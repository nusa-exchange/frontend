<template>
  <form class="profile-form" @submit.prevent="update_profile">
    <form-row
      :label="translation('form.country.label')"
      type="select"
      :rows="COUNTRY"
      v-model="country"
    />
    <form-row
      :label="translation('form.first_name.label')"
      type="input"
      :placeholder="translation('form.first_name.placeholder')"
      v-model="first_name"
    />
    <form-row
      :label="translation('form.last_name.label')"
      type="input"
      :placeholder="translation('form.last_name.placeholder')"
      v-model="last_name"
    />

    <div class="form-row">
      <div class="form-label">{{ translation('form.birthday.label') }}:</div>
      <div class="form-control">
        <a-date-picker
          @change="onDatePickerChange"
          :placeholder="translation('form.birthday.placeholder')"
        />
      </div>
    </div>

    <form-row
      :label="translation('form.address.label')"
      type="input"
      :placeholder="translation('form.address.placeholder')"
      v-model="address"
    />
    <div class="flex-form-row">
      <form-row
        :label="translation('form.postcode.label')"
        type="input"
        :placeholder="translation('form.postcode.label')"
        v-model="postcode"
      />
      <form-row :label="translation('form.city.label')" type="input" :placeholder="translation('form.city.label')" v-model="city" />
    </div>

    <div class="form-row">
      <div class="form-label"></div>
      <div class="form-control">
        <button type="submit" :disabled="button_disabled">
          <a-icon v-if="loading" type="loading" />
          {{ $t('page.global.action.submit') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "form-row": () => import("./form-row.vue"),
    "auto-complete": () => import("@/components/desktop/AutoComplete.vue")
  }
})
export default class ProfileForm extends Vue {
  loading = false;
  first_name = "";
  last_name = "";
  dob = "";
  address = "";
  postcode = "";
  city = "";
  country = this.COUNTRY[0];

  get COUNTRY() {
    return helpers.getAllRegion().map(country => country.name);
  }

  get button_disabled() {
    if (this.loading) return true;

    return !(
      this.first_name &&
      this.last_name &&
      this.dob &&
      this.address &&
      this.postcode &&
      this.city &&
      this.country
    );
  }

  onDatePickerChange(m_date) {
    this.dob = m_date.toISOString();
  }

  async update_profile() {
    this.loading = true;

    await this.UserController.update_profile(
      this.first_name,
      this.last_name,
      this.dob,
      this.address,
      this.postcode,
      this.city,
      helpers.getAllRegion().find(country => country.name == this.country).code
    );

    this.loading = false;
  }

  translation(message: string, data?: {}) {
    return helpers.translation("page.account.kyc_account_verification." + message, data);
  }
}
</script>
