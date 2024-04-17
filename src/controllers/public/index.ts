import ApiClient from "@/library/z-apiclient";
import { applyMixins } from "../mixins";
import store from "./store";
import Helpers from "./helpers";
import GettersSetters from './getters_setters';
import config from "@/config";

export class PublicController {
  store = store;
  helpers = new Helpers(this.store);

  set_title(title: string) {
    document.title = title;
  }

  async fetch_config() {
    try {
      const { data } = await new ApiClient("trade").get("public/config");

      this.currencies = data.currencies;
      this.markets = data.markets;
      this.trading_fees = data.trading_fees;
    } catch (error) {
      return error;
    }
  }

  async fetch_tickers() {
    try {
      const { data } = await new ApiClient("trade").get("public/markets/tickers?limit=1000");
      const tickers = {};

      for (const id in data) {
        const ticker = data[id].ticker;

        tickers[id] = ticker;
      }

      this.tickers = tickers;

    } catch (error) {
      return error;
    }
  }

  async fetch_global_price() {
    try {
      const { data } = await new ApiClient(config.finex ? "finex" : "trade").get("public/global_price");

      this.global_price = data;
    } catch (error) {
      return error;
    }
  }

  async fetch_banners() {
    try {
      const { data } = await new ApiClient("applogic").get("public/banners");

      const banners: ZTypes.Banner[] = data;
      const get_image_preview = async (uuid: string) => {
        try {
          const { data } = await new ApiClient("applogic").get(`public/banners/preview/${uuid}`, null, { responseType: "arraybuffer" });
  
          return ["data:image/png;base64", Buffer.from(data, "binary").toString("base64")].join(",");
        } catch (error) {
          return null;
        }
      }
  
      await Promise.all(banners.map(async banner => {
        const img_base64 = await get_image_preview(banner.uuid);
  
        banner.image = img_base64;
        banner
      }));

      this.banners = banners;
    } catch (error) {
      return error;
    }
  }

  async fetch_broadcasts() {
    try {
      const { data } = await new ApiClient("applogic").get("public/broadcasts");

      this.broadcasts = data;
    } catch (error) {
      return error;
    }
  }

  update_ticker_price(market: string, price: number) {
    const fPrice = Number(price);
    const fLow = Number(this.tickers[market].low);
    const fHigh = Number(this.tickers[market].high);

    this.tickers[market].last = price.toString();
    if (fPrice < fLow) {
      this.tickers[market].low = price.toString();
    } else if (fPrice > fHigh) {
      this.tickers[market].high = price.toString();
    }
  }
}

export interface PublicController extends GettersSetters {
}

applyMixins(PublicController, [GettersSetters]);

const class_mounted = new PublicController();

export default class_mounted;
