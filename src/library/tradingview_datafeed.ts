import { TradeController } from '@/controllers';
import ApiClient from "@/library/z-apiclient";
import ZSmartModel from "@/library/z-eventbus";
import DatafeedApi from "../../public/charting_library/datafeed-api";
import TradingView from "../../public/charting_library/charting_library";

let store;
const supportedResolutions = [
  "1",
  "3",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "D"
];

const history = {};

const config = {
  supported_resolutions: supportedResolutions
};

const createChannelString = symbolInfo => {
  const channel = symbolInfo.name.split(/[:/]/);
  return channel[0] + "/" + channel[1];
};

export default class DataFeed implements TradingView.IBasicDataFeed {
  onReady(cb) {
    cb(config);
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback) {
    const symbol_stub = {
      name: symbolName,
      description: "",
      type: "crypto",
      session: "24x7",
      timezone: "Etc/UTC",
      ticker: symbolName,
      minmov: 1,
      pricescale: Math.pow(10, TradeController.market.price_precision),
      has_intraday: true,
      intraday_multipliers: ["1", "5", "15", "30", "60", "240"],
      supported_resolution: supportedResolutions
    };

    onSymbolResolvedCallback(symbol_stub);
  }

  searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: TradingView.SearchSymbolsCallback) {
  }

  async getBars(symbolInfo: TradingView.LibrarySymbolInfo, resolution: TradingView.ResolutionString, periodParams: TradingView.PeriodParams, onResult: TradingView.HistoryCallback, onError: TradingView.ErrorCallback) {
    if (resolution === "D" || resolution === "1D") resolution = "1440" as TradingView.ResolutionString;
    if (resolution === "1W") resolution = "10080" as TradingView.ResolutionString;
    if (periodParams.firstDataRequest) {
      ZSmartModel.emit("tradingview-rending");
    }

    const payload = {
      period: resolution,
      time_from: periodParams.from,
      time_to: periodParams.to,
      limit: periodParams.countBack
    };
    const url = "public/markets/" + TradeController.market.id + "/k-line";
    try {
      const { data } = await new ApiClient("trade").get(url, payload);
      const bars = data.map(el => ({
        time: el[0] * 1000,
        open: el[1],
        high: el[2],
        low: el[3],
        close: el[4],
        volume: el[5]
      }));

      if (periodParams.firstDataRequest) {
        history[symbolInfo.name] = { lastBar: bars.length ? bars[bars.length - 1] : null };
        ZSmartModel.emit("tradingview-ready");
      }

      onResult(bars, { noData: !bars.length });
    } catch (error) {
      onError(error);
      return error;
    }
  }

  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID) {
    const channelString = createChannelString(symbolInfo);
    const newSub = {
      channelString,
      subscribeUID,
      resolution,
      symbolInfo,
      lastBar: history[symbolInfo.name].lastBar,
      listener: onRealtimeCallback
    };
    TradeController.tradingview.stream = newSub;
  }

  unsubscribeBars(subscriberUID) {
  }

  calculateHistoryDepth(resolution) {
    return resolution < 60
      ? { resolutionBack: "D", intervalBack: "1" }
      : undefined;
  }
}
