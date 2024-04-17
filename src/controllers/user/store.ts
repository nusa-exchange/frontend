import Vue from "vue";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

interface UserPhone {
  number?: string;
  country?: string;
  validated_at: false;
  validated: boolean;
}

export interface Store {
  state?: "loading" | "pending" | "active" | "banned";
  email?: string;
  uid?: string;
  role?: string;
  level?: number;
  otp: boolean;
  phone: UserPhone;
  labels: ZTypes.UserLabel[];
  balances: ZTypes.Balance[];
  need2fa: boolean;
  session: {
    sended_email: boolean;
    password: string;
    reset_password_token: string;
  }
}

const store: Store = reactive<Store>({
  state: null,
  email: null,
  uid: null,
  role: null,
  level: null,
  otp: false,
  phone: {
    number: null,
    country: null,
    validated_at: null,

    get validated() {
      return !!(this.validated_at as UserPhone["validated_at"]);
    }
  },
  labels: [],
  balances: [],
  need2fa: false,
  session: {
    sended_email: false,
    password: "",
    reset_password_token: ""
  }
});

export default store;
