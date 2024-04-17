import router from "@/router";
import ApiClient from "@/library/z-apiclient";
import { ActionTree } from "vuex";

const actions: ActionTree<UserState, RootState> = {
  async GET_ACTIVITY({ commit }, payload) {
    commit("GET_ACTIVITY", payload);
    try {
      const url = "resource/users/activity";
      const response = await new ApiClient("auth").get(url, payload);
      commit("SET_ACTIVITY", response);
    } catch (error) {
      return error;
    }
  },
  async GET_API_KEYS({ commit }, payload) {
    commit("GET_API_KEYS", payload);
    try {
      const url = "resource/api_keys";
      const response = await new ApiClient("auth").get(url, payload);
      commit("SET_API_KEYS", response);
    } catch (error) {
      return error;
    }
  },
  async CREATE_API_KEYS({ commit }, payload) {
    try {
      const url = "resource/api_keys";
      const { data } = await new ApiClient("auth").post(url, payload);
      commit("CREATE_API_KEYS", data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async DELETE_API_KEYS({ commit }, payload) {
    const { kid, totp_code } = payload;
    try {
      const url = "resource/api_keys/" + kid;
      const response = await new ApiClient("auth").delete(url, { totp_code });
      commit("DELETE_API_KEYS", payload);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async UPDATE_API_KEYS({ state, commit }, { kid, state_, totp_code }) {
    const index = state.api_keys.array.findIndex(e => e.kid == kid);
    state.api_keys.array[index].loading = true;
    try {
      const url = "resource/api_keys/" + kid;
      const response = await new ApiClient("auth").patch(url, {
        state: state_,
        totp_code
      });
      commit("UPDATE_API_KEYS", response.data);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

export default actions;