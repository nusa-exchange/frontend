import router from "@/router";
import * as helpers from "@/library/z-helpers";
import { MutationTree } from "vuex";
import { runNotice } from "@/mixins";

const mutations: MutationTree<UserState> = {
  GET_ACTIVITY(state, { page }) {
    state.activity.loading = true;
    state.activity.array = [];
    state.activity.page = page;
  },
  GET_API_KEYS(state, { page }) {
    state.api_keys.loading = true;
    state.api_keys.array = [];
    state.api_keys.page = page;
  },
  SET_ACTIVITY(state, { headers, data }) {
    state.activity.loading = false;
    state.activity.array = data;
    state.activity.max = Number(headers.total);
  },
  SET_API_KEYS(state, { headers, data }) {
    state.api_keys.loading = false;
    state.api_keys.array = data;
    state.api_keys.max = Number(headers.total);
  },
  CREATE_API_KEYS(state, payload) {
    state.api_keys.array.push(payload);
  },
  DELETE_API_KEYS(state, payload) {
    const index = state.api_keys.array.findIndex(e => e.kid == payload.kid);
    state.api_keys.array.splice(index, 1);
  },
  UPDATE_API_KEYS(state, payload) {
    const index = state.api_keys.array.findIndex(e => e.kid == payload.kid);
    state.api_keys.array[index].state = payload.state;
    state.api_keys.array[index].loading = false;
  },
  CHECK_RESET_TOKEN(state, { payload, token }) {
    if (payload === 201) state.session.reset_password_token = token;
    router.push("/resetpassword");
  },
  LOGOUT(state, type = false) {
    localStorage.removeItem("csrf_token");
    state.state = "";
    if (!type) return;
    router.push("/");
    runNotice("success", helpers.translation("LOG OUT"));
  },
  ENABLE_OTP: state => (state.otp = true)
};

export default mutations;