import config from "@/config";
import router from "@/router";
import store from "@/store";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { i18n } from "@/plugins";
import ZSmartModel from "@/library/z-eventbus";
import { UserController } from "@/controllers";
import { runNotice } from "@/mixins";
import { jsonToParam } from "./helpers";

const LIST_WARNING = [
  "identity.session.missing_otp",
  "identity.session.not_active",
  "identity.user.active_or_doesnt_exist"
];

const NoticeWaring = (message: string) => {
  runNotice("t-warning", (i18n.t(message) as string));
};

const NoticeError = (message: string) => {
  runNotice("t-error", (i18n.t(message) as string));
};

const sleep = async (ms: number) => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), ms));
}

const formatError = async (error: any) => {
  const { response } = error;
  const errors: string[] = response.data.errors;
  if (UserController.state == "active" && response.status == 401 && !response.data?.errors?.includes("authz.invalid_permission")) {
    ZSmartModel.emit("user/LOGOUT");
    return;
  }

  for await (const message of errors) {
    if (LIST_WARNING.includes(message)) {
      //======UnAuth=====//
      if (LIST_WARNING[0] === message) {
        UserController.need2fa = true;
      } else if (LIST_WARNING[1] === message) {
        const payload = JSON.parse(response.config.data);
        store.commit("user/WAIT_EMAIL", payload);
      } else if (LIST_WARNING[2] === message) {
        router.push("/");
      }
      return NoticeWaring(message);
    } else if (!(["authz.invalid_session", "resource.user.no_activity"].includes(message))) {
      NoticeError(message);
    }
  }

  sleep(10);
};

const csrf_headers = () => {
  const csrf_token = localStorage.getItem("csrf_token");
  const headers = { "X-CSRF-Token": csrf_token };

  return csrf_token ? headers : {};
};

const getClient = (baseURL: string) => {
  const client = axios.create({ baseURL, headers: csrf_headers() });
  client.interceptors.response.use(
    response => Promise.resolve(response),
    error => {
      formatError(error);
      return Promise.reject(error);
    }
  );
  return client;
};

class ApiClient {
  private client: AxiosInstance;
  constructor(request: string) {
    this.client = getClient(config.api.url + request);
  }

  async get(url: string, data: any = {}, conf: AxiosRequestConfig = {}) {
    try {
      const response = await this.client.get(
        url + jsonToParam(data, url.includes("?") ? "&" : "?"),
        conf
      );
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(url: string, data: any = {}, conf: AxiosRequestConfig = {}) {
    try {
      const response = await this.client.delete(
        url,
        {
          data: data,
          ...conf
        }
      );
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async head(url: string, conf: AxiosRequestConfig = {}) {
    try {
      const response = await this.client.head(url, conf);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async options(url: string, conf: AxiosRequestConfig = {}) {
    try {
      const response = await this.client.options(url, conf);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async post(url: string, data: any = {}, conf: AxiosRequestConfig = {}) {
    try {
      const response = await this.client.post(url, data, conf);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async put(url: string, data: any = {}, conf: AxiosRequestConfig = {}) {
    try {
      const response = await this.client.put(url, data, conf);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async patch(url: string, data: any = {}, conf: AxiosRequestConfig = {}) {
    try {
      const response = await this.client.patch(url, data, conf);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default ApiClient;
