import colors from "@/colors";

export interface ChartConfig {
  gap: number;
  paddingTop: number;
  buyStrokeColor: string;
  sellStrokeColor: string;
  buyFillColor: string;
  sellFillColor: string;
  strokeSize: number;
}

export interface GirdConfig {
  color: string;
  dashValue: number[];
  style: "solid" | "dash";
  size: number;
}

export interface yAxisChartConfig {
  width: number;
  axisLine: {
    color: string;
    display: boolean;
    size: number;
  };
  tickLine: {
    color: string;
    display: boolean;
    width: number;
    size: number;
  };
  tickText: {
    position: "inside" | "outside";
    color: string;
    size: number;
    baseLine: "top" | "middle" | "bottom";
    margin: number;
  };
}

export interface xAxisChartConfig {
  height: number;
  axisLine: {
    color: string;
    display: boolean;
    size: number;
  };
  tickLine: {
    color: string;
    display: boolean;
    height: number;
    size: number;
  };
  tickText: {
    color: string;
    size: number;
    margin: number;
  };
}

export interface TooltipConfig {
  type: "standard" | "rect";
  crosshair: {
    size: number;
    type: "solid" | "dash";
    color: string | "side";
    dashValue: [4, 4];
  };
  standard: {
    size: number;
    color: string;
    bgColor: string;
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
  };
  rect: {
    title: {
      size: number;
      color: string;
      price: string;
      amount: string;
    };
    value: {
      size: number;
      color: string;
    };
  };
}

export interface Config {
  chart: ChartConfig;
  gird: {
    horizontal: GirdConfig;
    vertical: GirdConfig;
  };
  yAxis: yAxisChartConfig;
  xAxis: xAxisChartConfig;
  tooltip: TooltipConfig;
}

export const default_config: Config = {
  chart: {
    gap: 5,
    paddingTop: 30,
    buyStrokeColor: colors["up-color"],
    sellStrokeColor: colors["down-color"],
    buyFillColor: colors["up-bg-color"],
    sellFillColor: colors["down-bg-color"],
    strokeSize: 1,
  },
  gird: {
    horizontal: {
      color: colors["border-color"],
      dashValue: [2, 2],
      style: "solid",
      size: 0.5,
    },
    vertical: {
      color: colors["border-color"],
      dashValue: [4, 4],
      style: "dash",
      size: 0.5,
    },
  },
  yAxis: {
    width: 50,
    axisLine: {
      color: colors["border-color"],
      display: true,
      size: 0.5,
    },
    tickLine: {
      color: colors["border-color"],
      display: false,
      width: 0,
      size: 0,
    },
    tickText: {
      position: "inside",
      baseLine: "bottom",
      color: colors["color-gray"],
      margin: 0,
      size: 10,
    },
  },
  xAxis: {
    height: 20,
    axisLine: {
      color: colors["border-color"],
      display: true,
      size: 0.5,
    },
    tickLine: {
      color: colors["border-color"],
      display: false,
      height: 0,
      size: 0,
    },
    tickText: {
      color: colors["color-gray"],
      size: 8,
      margin: (20 + 8) / 2, // (height + size) / 2
    },
  },
  tooltip: {
    type: "standard",
    crosshair: {
      size: 1,
      color: colors["color-gray"],
      type: "solid", //solid | dash,
      dashValue: [4, 4],
    },
    standard: {
      size: 8,
      color: colors["text-default-color"],
      bgColor: colors["color-gray"],
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 1,
      paddingBottom: 1,
    },
    rect: {
      title: {
        size: 12,
        color: colors["text-default-color"],
        price: "Price",
        amount: "Amount",
      },
      value: {
        size: 12,
        color: colors["text-default-color"],
      },
    },
  },
};
