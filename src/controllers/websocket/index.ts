import config from "@/config";
import ZSocket from "@/library/ZSocket";
import ZSmartModel from "@/library/z-eventbus";

const RESOLUTION_STREAM = {
  "1": "1m",
  "5": "5m",
  "15": "15m",
  "30": "30m",
  "60": "1h",
  "1D": "1d",
  "1W": "1w"
};

class WebSocketController {
  private sockets = {
    public: new ZSocket(config.api.ws.public, (socket: ZSocket) => {
      const payload = JSON.stringify({
        event: "subscribe",
        streams: ["global.tickers"]
      });
  
      socket.send(payload);
    }),
    private: new ZSocket(
      config.api.ws.private,
      undefined,
      "private"
    )
  }

  constructor() {
    this.sockets.public.connect();

    ZSmartModel.on("user/LOGIN", () => {
      this.sockets.private.connect();
    });
    ZSmartModel.on("user/LOGOUT", () => {
      if (this.sockets.private.is_connected) this.sockets.private.close();
    });
  }

  subscribe(type: "public" | "private", channel: string) {
    this.sockets[type].subscribe(channel);
  }

  unsubscribe(type: "public" | "private", channel: string) {
    this.sockets[type].unsubscribe(channel);
  }
}

export { WebSocketController };

export default new WebSocketController();
