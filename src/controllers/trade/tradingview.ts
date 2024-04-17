import Vue from "vue";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

type TradingViewResolution = "1" | "5" | "15" | "30" | "60" | "1D" | "1W";

interface TradingViewLastBar {
  time?:         number;
  open?:         number;
  high?:         number;
  low?:          number;
  close?:        number;
  volume?:       number;
  isLastBar?:    boolean;
  isBarClosed?:  boolean;
}

interface TradingViewSymbolInfo {
  name:                 string;
  description:          string;
  type:                 string;
  session:              string;
  timezone:             string;
  ticker:               string;
  minmov:               number;
  pricescale:           number;
  has_intraday:         boolean;
  intraday_multipliers: string[];
  supported_resolution: string[];
  base_name:            string[];
  legs:                 string[];
  full_name:            string;
  pro_name:             string;
  data_status:          string;
}

interface TradingViewStream {
	channelString: string;
	lastBar?: TradingViewLastBar
	listener: (lastBar: TradingViewLastBar) => void;
	resolution: TradingViewResolution;
	subscribeUID: string;
	symbolInfo: TradingViewSymbolInfo;
}

export default class TradingView {
  private store = reactive<{
    ready: boolean,
    stream?: TradingViewStream;
		resolution: TradingViewStream["resolution"];
  }>({
    ready: false,
    stream: null,
    resolution: (localStorage.getItem("tradingview.resolution") as TradingViewResolution) || "15"
  });

  get ready() {
    return this.store.ready;
  }

  set ready(ready) {
    this.store.ready = ready;
  }

  get stream() {
    return this.store.stream;
  }

  set stream(stream) {
    this.store.stream = stream;
  }

  get resolution() {
    return this.store.resolution;
  }

  set resolution(resolution) {
    localStorage.setItem("tradingview.resolution", resolution);

    this.store.resolution = resolution;
  }

  add_update_chart(payload: TradingViewLastBar, payload_type: "kline" | "trade") {
    if (!this.ready) return;
    let lastBar = this.stream.lastBar;
    let resolution = Number(this.resolution);

    if (this.resolution.includes("D")) {
      resolution = 1440;
    } else if (this.resolution.includes("W")) {
      resolution = 10080;
    }

    const coeff = resolution * 60;
    const rounded = Math.floor(payload.time / coeff) * coeff;

    if (!lastBar || rounded > lastBar.time / 1000) {
      lastBar = {
        time: rounded * 1000,
        open: payload.close,
        high: payload.close,
        low: payload.close,
        close: payload.close,
        volume: payload.volume
      }
    } else {
      if (!lastBar.time) lastBar.time = rounded * 1000;
      if (!lastBar.open) lastBar.open = payload.close;
      if (!lastBar.high) lastBar.high = payload.close;
      if (!lastBar.low) lastBar.low = payload.close;
      lastBar.close = payload.close;

      if (payload.close < lastBar.low) lastBar.low = payload.close;
      if (payload.high > lastBar.high) lastBar.high = payload.high;

      if (lastBar.volume) {
        lastBar.volume += payload.volume;
      } else {
        lastBar.volume = payload.volume;
      }
    }

    this.stream.lastBar = lastBar;
    this.stream.listener(lastBar);
  }
}
