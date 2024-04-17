<template>
  <div class="trade-action-balance">
    <span>
      {{ $t("page.global.table.available") }}: {{ balance() }}
      {{ currency.toUpperCase() }}
    </span>

    <router-link class="trade-action-balance-action" to="/assets/balance">
      {{ $t("page.global.action.deposit") }}
    </router-link>
  </div>
</template>

<script>
import { UserController } from "@/controllers";
import * as helpers from "@/library/z-helpers";

export default {
  props: {
    currency: String
  },
  computed: {
    isAuth: () => UserController.state == "active"
  },
  methods: {
    balance() {
      return new helpers.Balance(this.currency).available;
    }
  }
};
</script>
