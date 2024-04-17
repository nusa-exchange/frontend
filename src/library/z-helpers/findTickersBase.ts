import { PublicController, TradeController } from '@/controllers';

const getSearch = (isDesktop: boolean) => {
  return isDesktop ? ["base_unit"] : ["base_unit", "quote_unit"];
};

interface Base {
  market: string;
  search: string[];
  [key: string]: string | string[];
}

export const findTickersBase = (
  tickers: ZTypes.Ticker[],
  findBy: string,
  data: string,
  isDesktop = false
) => {
  const base: Base = {
    market:
      findBy === "market" && data !== "Favorites" ? "quote_unit" : "Favorites",
    search: getSearch(isDesktop)
  };
  return tickers.filter(ticker => {
    if (base[findBy] === "Favorites") {
      return PublicController.helpers.check_favorite(ticker.name);
    } else if (findBy === "market") {
      if (data === "All") return true;
      return data.toLowerCase() === String(ticker[base.market]).toLowerCase();
    } else if (findBy === "search") {
      for (const row of base.search) {;
        if (String(ticker[row]).includes(data.toLowerCase())) return true;
      }
      return base.search
        .map(row => ticker[row])
        .join("")
        .includes(data);
    }
  });
};
