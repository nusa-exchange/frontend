import ZSmartModel from "@/library/z-eventbus";
import ApiClient from "@/library/z-apiclient";
import { applyMixins } from "../mixins";
import MineControl from "./mine_control";
import OrdersController from "./orders";
import OrderBook from "./orderbook";
import store from "./store";
import GettersSetters from "./getters_setters";
import config from '@/config';
import { PublicController, UserController } from '..';
import { IsMobile, runNotice } from "@/mixins";
import TradingView from "./tradingview";
import router from '@/router';

export class TradeController {
  constructor() {
    this.create_mine_control();
    this.store = store;
    this.tradingview = new TradingView();

    ZSmartModel.on("page-ready", () => {
      this.market = PublicController.markets.find(market => market.id == (localStorage.getItem("market") || config.default_market));
      this.orderbook = new OrderBook(null);
    });
  }

  open_exchange(market_id: string, side?: ZTypes.OrderSide, exchange_layout = this.store.exchange_layout) {
    const market = PublicController.markets.find(market => market.id == market_id);

    if (this.market.id != market.id) {
      ZSmartModel.emit("exchange-render", market.id, this.market.id);
      this.market = market;
    }

    localStorage.setItem("market", this.market.id);
    if (["/exchange", "/m/exchange"].includes(router.currentRoute.path)) return;

    if (IsMobile()) {
      router.push({ path: "/m/exchange", query: { type: side } });
    } else {
      router.push({ name: "ExchangePage", params: { name: this.market.name.replace("/", "-") }, query: { type: exchange_layout } });
    }
  }

  get_best_price(side: ZTypes.OrderSide | ZTypes.TakerType) {
    if (side === "buy") side = "bids";
    if (side === "sell") side = "asks";

    const depth = this.orderbook.toArray(side, 1);

    if (depth.length) return depth[0].price;
    return null;
  }

  get_depth(market_id: string, limit = 100) {
    return new ApiClient(config.finex ? "finex" : "trade").get("public/markets/" + market_id + "/depth", { limit: limit });
  }

  async get_public_trades(market_id: string, limit = 100) {
    try {
      const { data } = await new ApiClient("trade").get("public/markets/" + market_id + "/trades", { limit: limit });

      const market = PublicController.markets.find(market => market.id === market_id);

      data.map(trade => {
        trade.price = trade.price.toFixed(market.price_precision);
        trade.amount = trade.amount.toFixed(market.amount_precision);
        trade.total = trade.total.toFixed(market.total_precision);

        return trade;
      })

      this.trades = data;
    } catch (error) {
      return error;
    }
  }

  add_trade(trade: ZTypes.PublicTrade) {
    document.title = `${trade.price} - ${this.market.name.toUpperCase()} - ${config.nameEX}`;

    PublicController.update_ticker_price(trade.market, trade.price);

    this.trades.unshift({
      id: trade.id,
      price: trade.price,
      amount: trade.amount,
      total: trade.total,
      market: trade.market,
      created_at: trade.created_at,
      taker_type: trade.taker_type
    });

    this.trades.splice(100, 1);
  }

  get_deposits(payload?: { currency?: string; state?: string; time_from?: string; time_to?: string; limit?: number; page?: number; }) {
    if (!payload) payload = {};
    if (!payload.page) payload.page = 1;
    if (!payload.limit) payload.limit = 100;

    return new ApiClient("trade").get("account/deposits", payload);
  }

  get_withdraws(payload?: { currency?: string; state?: string; time_from?: string; time_to?: string; limit?: number; page?: number; }) {
    if (!payload) payload = {};
    if (!payload.page) payload.page = 1;
    if (!payload.limit) payload.limit = 100;

    return new ApiClient("trade").get("account/withdraws", payload);
  }

  async get_deposit_address(currency_id: string, blockchain_key: string) {
    const { data } = await new ApiClient("trade").get(`account/deposit_address/${currency_id}?blockchain_key=${blockchain_key}`)

    return data;
  }

  async create_withdrawal(currency_id: string, amount: number, otp_code: string, confirmation_code: string, address?: string, blockchain_key?: string, beneficiary_id?: string, callback?: (payload?: any) => void) {
    const payload = { address, blockchain_key, beneficiary_id, currency: currency_id, amount, otp_code, confirmation_code };

    try {
      const { data } = await new ApiClient("applogic").post("account/withdraws", payload);
      runNotice("success", "withdraw.created");

      if (callback) callback(data);
    } catch (error) {
      return error;
    }
  }

  async generate_withdrawal_code(currency_id: string, amount: number, callback?: () => void) {
    try {
      await new ApiClient("applogic").post("account/withdraws/generate_code", { currency: currency_id, amount });
      runNotice("success", "withdraw.code");

      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  fetch_ieo_list() {
    return new ApiClient("finex").get("public/ieo/list");
  }

  fetch_ieo(id: number) {
    return new ApiClient("finex").get((UserController.isAuth ? "/ieo/" : "public/ieo/") + id);
  }

  create_ieo_order(ieo_id: number, payment_currency: string, quantity: string) {
    return new ApiClient("finex").post("ieo", {
      ieo_id,
      payment_currency,
      quantity
    });
  }
}

export interface TradeController extends OrdersController, MineControl, GettersSetters {
  orderbook?: OrderBook;
  tradingview: TradingView;
}
applyMixins(TradeController, [OrdersController, MineControl, GettersSetters]);
const class_mounted = new TradeController();

export default class_mounted;
