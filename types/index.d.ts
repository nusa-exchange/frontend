type Side = ZTypes.TakerType;

import { TradeController } from '@/controllers/trade';
import { PublicController } from '@/controllers/public';
import { UserController } from '@/controllers/user';
import { WebSocketController } from '@/controllers/websocket';
import * as helpers from "@/mixins/helpers";

declare module "vue/types/vue" {
  interface Vue {
    PublicController: PublicController;
    TradeController: TradeController;
    UserController: UserController;
    WebSocketController: WebSocketController;
    helpers: typeof helpers,
  }
}

declare global {
  interface Number {
    toFixedNumber: (digits: number, base?: number) => number;
  }

  interface String {
    capitalize: () => string;
  }

  namespace ZTypes {
    type Theme = "night" | "light";
    type OrderSide = "buy" | "sell";
    type OrdType = "limit" | "market";
    type OrderState = "pending" | "wait" | "done" | "cancel";
    type TakerType = "asks" | "bids";
    type MessageType = "success" | "info" | "warning" | "error";
    type NoticeType = MessageType;
  
    interface Currency {
      id: string;
      status: "enabled" | "disabled";
      name: string;
      price: string;
      type: "coin" | "fiat";
      precision: number;
      position: number;
      description?: string;
      homepage?: string;
      networks: Network[];
    }

    interface Network {
      blockchain_key: string;
      currency_id: string;
      deposit_enabled: boolean;
      withdrawal_enabled: boolean;
      deposit_fee: string;
      min_deposit_amount: string;
      withdraw_fee: string;
      min_withdraw_amount: string;
      base_factor: number;
      explorer_transaction: string;
      explorer_address: string;
      description?: string;
      warning?: string;
      protocol: string;
      min_confirmations: string;
    }
  
    interface Market {
      id: string;
      symbol: string;
      name: string;
      type: string;
      base_unit: string;
      quote_unit: string;
      min_price: string;
      max_price: string;
      min_amount: string;
      amount_precision: number;
      price_precision: number;
      total_precision: number;
      state: string;
    }
  
    interface Tickers {
      [key: string]: Ticker;
    }
  
    interface Ticker {
      id: string;
      name: string;
      base_unit: string;
      quote_unit: string;
      low: string;
      high: string;
      last: string;
      open: string;
      amount: string;
      volume: number;
      sell: string;
      buy: string;
      avg_price: string;
      price_change_percent: string;
      [key: string]: string | number;
    }
  
    interface GlobalPrice {
      [key: string]: {
        [key: string]: number;
      };
    }
  
    interface PublicTrade {
      id: number;
      price: number;
      amount: number;
      total: number;
      market: string;
      created_at: number;
      taker_type: OrderSide;
    }
  
    interface Order {
      uuid: string;
      side: OrderSide;
      ord_type: OrdType;
      price: string;
      avg_price: string;
      state: OrderState;
      market: string;
      created_at: Date;
      updated_at: Date;
      origin_volume: string;
      remaining_volume: string;
      executed_volume: string;
      trades_count: number;
    }
  
    interface Trade extends PublicTrade {
      fee_currency: string;
      fee: string;
      fee_amount: string;
      side: OrderSide;
      order_id: number;
    }
  
    interface Balance {
      currency: string;
      balance: string;
      locked: string;
    }

    interface UserLabel {
      key:        string;
      value:      "pending" | "submitted" | "verified" | "rejected";
      scope:      "public" | "private";
      created_at: Date;
      updated_at: Date;
    }
  
    interface Activity {
      id: number;
      user_id: number;
      target_uid: string | null;
      category: string;
      user_ip: string;
      user_agent: string;
      topic: string;
      action: string;
      result: string;
      data: any;
      created_at: Date;
    }

    interface TradingFee {
      id:             number;
      group:          string;
      market_id:      string;
      maker:          string;
      taker:          string;
      created_at:     Date;
      updated_at?:    Date;
    }
  
    interface Overrides {
      volumePaneSize: "medium",
      "scalesProperties.lineColor": string,
      "scalesProperties.textColor": string,
      "paneProperties.background": string,
      "paneProperties.vertGridProperties.color": string,
      "paneProperties.horzGridProperties.color": string,
      "paneProperties.crossHairProperties.color": string,
      "paneProperties.legendProperties.showLegend": false,
      "paneProperties.legendProperties.showStudyArguments": boolean,
      "paneProperties.legendProperties.showStudyTitles": boolean,
      "paneProperties.legendProperties.showStudyValues": boolean,
      "paneProperties.legendProperties.showSeriesTitle": boolean,
      "paneProperties.legendProperties.showSeriesOHLC": boolean,
      "mainSeriesProperties.candleStyle.upColor": string,
      "mainSeriesProperties.candleStyle.downColor": string,
      "mainSeriesProperties.candleStyle.drawWick": boolean,
      "mainSeriesProperties.candleStyle.drawBorder": boolean,
      "mainSeriesProperties.candleStyle.borderColor": string,
      "mainSeriesProperties.candleStyle.borderUpColor": string,
      "mainSeriesProperties.candleStyle.borderDownColor": string,
      "mainSeriesProperties.candleStyle.wickUpColor": string,
      "mainSeriesProperties.candleStyle.wickDownColor": string,
      "mainSeriesProperties.candleStyle.barColorsOnPrevClose": boolean,
      "mainSeriesProperties.hollowCandleStyle.upColor": string,
      "mainSeriesProperties.hollowCandleStyle.downColor": string,
      "mainSeriesProperties.hollowCandleStyle.drawWick": boolean,
      "mainSeriesProperties.hollowCandleStyle.drawBorder": boolean,
      "mainSeriesProperties.hollowCandleStyle.borderColor": string,
      "mainSeriesProperties.hollowCandleStyle.borderUpColor": string,
      "mainSeriesProperties.hollowCandleStyle.borderDownColor": string,
      "mainSeriesProperties.hollowCandleStyle.wickColor": string,
      "mainSeriesProperties.haStyle.upColor": string,
      "mainSeriesProperties.haStyle.downColor": string,
      "mainSeriesProperties.haStyle.drawWick": boolean,
      "mainSeriesProperties.haStyle.drawBorder": boolean,
      "mainSeriesProperties.haStyle.borderColor": string,
      "mainSeriesProperties.haStyle.borderUpColor": string,
      "mainSeriesProperties.haStyle.borderDownColor": string,
      "mainSeriesProperties.haStyle.wickColor": string,
      "mainSeriesProperties.haStyle.barColorsOnPrevClose": boolean,
      "mainSeriesProperties.barStyle.upColor": string,
      "mainSeriesProperties.barStyle.downColor": string,
      "mainSeriesProperties.barStyle.barColorsOnPrevClose": boolean,
      "mainSeriesProperties.barStyle.dontDrawOpen": boolean,
      "mainSeriesProperties.lineStyle.color": string,
      "mainSeriesProperties.lineStyle.linewidth": 1,
      "mainSeriesProperties.lineStyle.priceSource": "close",
      "mainSeriesProperties.areaStyle.color1": string,
      "mainSeriesProperties.areaStyle.color2": string,
      "mainSeriesProperties.areaStyle.linecolor": string,
      "mainSeriesProperties.areaStyle.linewidth": 1,
      "mainSeriesProperties.areaStyle.priceSource": "close"
    }
  
    interface StudiesOverrides {
      "volume.volume.color.0": string,
      "volume.volume.color.1": string,
      "volume.volume.transparency": number
    }

    interface Banner {
      uuid:             string;
      url:              string;
      image?:           string;
    }

    interface BroadCast {
      url:              string;
      title:            string;
    }

    interface Deposit {
      id:               string;
      tid:              string;
      currency:         string;
      blockchain_key?:  string;
      protocol?:        string;
      warning?:         string;
      amount:           string;
      fee:              string;
      from_address?:    string[];
      txid?:            string;
      confirmations?:   number;
      state:            "submitted" | "canceled" | "rejected" | "accepted" | "aml_processing" | "aml_suspicious" | "processing" | "skipped" | "collected" | "fee_processing";
      transfer_type:    string;
      created_at:       Date;
      completed_at?:    Date;
    }

    interface Withdraw {
      id:               number;
      tid:              string;
      currency:         string;
      type:             string;
      amount:           string;
      fee:              string;
      blockchain_key?:  string;
      blockchain_txid?: string;
      rid?:             string;
      protocol?:        string;
      state:            "prepared" | "canceled" | "accepted" | "skipped" | "to_reject" | "rejected" | "processing" | "succeed" | "failed" | "errored" | "confirming";
      confirmations:    number;
      note?:            string;
      transfer_type:    string;
      created_at:       Date;
      updated_at:       Date;
      done_at?:         Date;
    }

    interface Beneficiary {
      id:                 number;
      currency:           string;
      uid:                string;
      name:               string;
      description?:       string;
      data: {
        address?:                           string;
        account_number?:                    string;
        bank_name?:                         string;
        bank_swift_code?:                   string;
        full_name?:                         string;
        intermediary_bank_name?:            string;
        intermediary_bank_swift_code?:      string;
      };
      state:              string;
      sent_at:            Date;
    }

    interface ReleaseCommission {
      id:                 number;
      account_type:       string;
      member_id:          number;
      earned_btc:         string;
      friend_trade:       number;
      friend:             number;
      created_at:         Date;
      updated_at:         Date;
    }

    interface Commission {
      id:                 number;
      account_type:       string;
      member_id:          number;
      friend_uid:         string;
      earned_amount:      string;
      currency_id:        string;
      parent_id:          number;
      parent_created_at:  Date;
      created_at:         Date;
      updated_at:         Date;
    }

    interface IEO {
      id:                     number;
      currency_id:            string;
      main_payment_currency:  string;
      payment_currencies:     string[];
      price:                  string;
      executed_quantity:      string;
      origin_quantity:        string;
      limit_per_user:         string;
      bought_quantity:        string;
      min_amount:             string;
      state:                  string;
      start_time:             number;
      ended:                  boolean;
      end_time:               number;
      data:                   string;
      created_at:             Date;
      updated_at:             Date;
    }

    interface IEOOrder {
      id:                     number;
      uuid:                   string;
      ieo_id:                 string;
      payment_currency:       string;
      price:                  string;
      quantity:               string;
      state:                  string;
      created_at:             Date;
      updated_at:             Date;
    }
  }
}

import { Tradingview } from "./exchange";
import { SessionState } from "./user";

interface MineControlConfig {
  market: string;
  ready: boolean;
  loading: boolean;
  realtime: boolean;
}

declare global {
  interface ExchangeState {
    trades: ZTypes.PublicTrade[];
    theme: ZTypes.Theme;
    TradingView: Tradingview;
  }

  interface UserState {
    state: SessionState;
    real_email: string;
    email: string;
    role: string;
    level: number;
    otp: boolean;
    uid: string;
    need2fa: boolean;
    checkLogged: boolean;
    balance: ZTypes.Balance[];
    session: {
      sended_email: boolean;
      password: string;
      reset_password_token: string;
    };
    activity: {
      loading: boolean;
      max: number;
      array: ZTypes.Activity[];
      page: number;
    };
    api_keys: {
      loading: boolean;
      max: number;
      array: any[];
      page: number;
    };
    phone: {
      number: string | null;
      country: string | null;
      validated: boolean;
    };
    labels: ZTypes.UserLabel[];
    reset_password_token: string;
  }

  interface WebSocketState {}

  interface RootState {
    exchange: ExchangeState;
    user: UserState;
    websocket: WebSocketState;
  }
}

export { };
