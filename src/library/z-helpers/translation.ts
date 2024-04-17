import { i18n } from "@/plugins";

export const translation = (message: string, data = {}) =>
  i18n.t(message, data);
