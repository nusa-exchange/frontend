import Vue from "vue";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export type ExchangeLayout = "basic" | "pro";
export interface Store {
	market?: ZTypes.Market;
	depth: {
		asks: {
			price: string;
			amount: string;
			change?: boolean;
		}[];
		bids: {
			price: string;
			amount: string;
			change?: boolean;
		}[];
		loading: boolean;
		sequence: number;
	};
	trades: ZTypes.PublicTrade[];
	open_orders: ZTypes.Order[];
	orders_history: ZTypes.Order[];
	trades_history: ZTypes.Trade[];
	exchange_layout: ExchangeLayout;
}

const store: Store = reactive<Store>({
	market: null,
	depth: {
		asks: [],
		bids: [],
		loading: false,
		sequence: 0
	},
	trades: [],
	open_orders: [],
	orders_history: [],
	trades_history: [],
	exchange_layout: (localStorage.getItem("exchange_layout") as ExchangeLayout) || "basic",
});

export default store;
