import backend from "./backend";
import Page from "./page";
import messages from "./messages";
import Modal from "./modal";

export default {
  locale: "en-US",
  name: "English",
  ...backend,
  ...Page,
  ...Modal,
  ...messages
};
