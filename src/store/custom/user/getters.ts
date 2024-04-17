import * as helpers from "@/library/z-helpers";
import { GetterTree } from "vuex";

const translation = (message: string, data?: {}) => helpers.translation("usercenter." + message, data);

const getters: GetterTree<UserState, RootState> = {
  isLoggedIn: state => state.state && state.state !== "loading",
  authStatus: state => state.state,
  getBalance: state => state.balance
};

export default getters;
