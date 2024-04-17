export default (ws = false) => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === "production") {
    const url = document.location.host;
    if (window.location.protocol === "https:")
      return ws === true ? "wss://" + url : "https://" + url;
    else return ws === true ? "ws://" + url : "http://" + url;
  } else {
    const url = window.document.location.hostname + ":3000";
    return ws === true ? "ws://" + url : "http://" + url;
  }
};
