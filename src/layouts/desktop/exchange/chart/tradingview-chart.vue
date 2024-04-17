<template>
  <div :id="element_id" />
</template>

<script lang="ts">
import uuid from "uuid/v4";
import TradingViewDataFeed from "@/library/tradingview_datafeed";
import config from "@/config";
import ZSmartModel from "@/library/z-eventbus";
import { Vue, Component } from "vue-property-decorator";
import { TradeController } from "@/controllers";
import colors from "@/colors";
import * as TradingView from "../../../../../public/charting_library/charting_library";

@Component({
  components: {
    "loading-page": () => import("@/layouts/loading-page.vue")
  }
})
export default class TradingViewChart extends Vue {
  element_id = uuid();

  public theme_interval : NodeJS.Timeout;
  public loading = false;
  public isAsk = TradeController.market.base_unit;
  public isBid = TradeController.market.quote_unit;
  public symbol = [this.isAsk, this.isBid].join("/").toUpperCase();
  public studies = [];
  public tvWidget!: TradingView.IChartingLibraryWidget;

  public studies_overrides: TradingView.StudyOverrides = {
    "volume.volume.color.0": colors["color-down"] as TradingView.StudyOverrideValueType,
    "volume.volume.color.1": colors["color-up"] as TradingView.StudyOverrideValueType,
    "volume.volume.transparency": 70 as TradingView.StudyOverrideValueType,
  }

  public overrides: TradingView.Overrides = {
    volumePaneSize: "medium",
    "scalesProperties.lineColor": colors["color-gray"],
    "scalesProperties.textColor": colors["color-gray"],
    "paneProperties.background": colors["bg-card-color"],
    "paneProperties.vertGridProperties.color": "#272c48",
    "paneProperties.horzGridProperties.color": "#272c48",
    "paneProperties.crossHairProperties.color": "#9194A3",
    "paneProperties.legendProperties.showLegend": true,
    "paneProperties.legendProperties.showStudyArguments": true,
    "paneProperties.legendProperties.showStudyTitles": true,
    "paneProperties.legendProperties.showStudyValues": true,
    "paneProperties.legendProperties.showSeriesTitle": true,
    "paneProperties.legendProperties.showSeriesOHLC": true,
    "mainSeriesProperties.candleStyle.upColor": colors["up-color"],
    "mainSeriesProperties.candleStyle.downColor": colors["down-color"],
    "mainSeriesProperties.candleStyle.drawWick": true,
    "mainSeriesProperties.candleStyle.drawBorder": true,
    "mainSeriesProperties.candleStyle.borderColor": "#4e5b85",
    "mainSeriesProperties.candleStyle.borderUpColor": colors["up-color"],
    "mainSeriesProperties.candleStyle.borderDownColor": colors["down-color"],
    "mainSeriesProperties.candleStyle.wickUpColor": colors["up-color"],
    "mainSeriesProperties.candleStyle.wickDownColor": colors["down-color"],
    "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
    "mainSeriesProperties.hollowCandleStyle.upColor": colors["up-color"],
    "mainSeriesProperties.hollowCandleStyle.downColor": colors["down-color"],
    "mainSeriesProperties.hollowCandleStyle.drawWick": true,
    "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
    "mainSeriesProperties.hollowCandleStyle.borderColor": "#4e5b85",
    "mainSeriesProperties.hollowCandleStyle.borderUpColor": colors["up-color"],
    "mainSeriesProperties.hollowCandleStyle.borderDownColor": colors["down-color"],
    "mainSeriesProperties.hollowCandleStyle.wickColor": "#737375",
    "mainSeriesProperties.haStyle.upColor": colors["up-color"],
    "mainSeriesProperties.haStyle.downColor": colors["down-color"],
    "mainSeriesProperties.haStyle.drawWick": false,
    "mainSeriesProperties.haStyle.drawBorder": false,
    "mainSeriesProperties.haStyle.borderColor": "#4e5b85",
    "mainSeriesProperties.haStyle.borderUpColor": colors["up-color"],
    "mainSeriesProperties.haStyle.borderDownColor": colors["down-color"],
    "mainSeriesProperties.haStyle.wickColor": "#4e5b85",
    "mainSeriesProperties.haStyle.barColorsOnPrevClose": false,
    "mainSeriesProperties.barStyle.upColor": colors["up-color"],
    "mainSeriesProperties.barStyle.downColor": colors["down-color"],
    "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
    "mainSeriesProperties.barStyle.dontDrawOpen": false,
    "mainSeriesProperties.lineStyle.color": "#4e5b85",
    "mainSeriesProperties.lineStyle.linewidth": 1,
    "mainSeriesProperties.lineStyle.priceSource": "close",
    "mainSeriesProperties.areaStyle.color1": "rgba(122, 152, 247, .1)",
    "mainSeriesProperties.areaStyle.color2": "rgba(122, 152, 247, .02)",
    "mainSeriesProperties.areaStyle.linecolor": "#4e5b85",
    "mainSeriesProperties.areaStyle.linewidth": 1,
    "mainSeriesProperties.areaStyle.priceSource": "close"
  }

  public widgetOptions: TradingView.ChartingLibraryWidgetOptions = {
      debug: false,
      symbol: this.symbol,
      datafeed: new TradingViewDataFeed(),
      interval: (localStorage.getItem("tradingview.resolution") || "15") as TradingView.ResolutionString,
      container: this.element_id,
      library_path: "/charting_library/",
      timezone: config.timeZone as TradingView.Timezone,
      locale: "en",
      custom_css_url: "custom.css",
      disabled_features: [
        "symbol_search_hot_key",
        "compare_symbol",
        "display_market_status",
        "go_to_date",
        // "header_chart_type",
        "header_compare",
        "header_toolbar_save_load",
        "header_interval_dialog_button",
        "header_resolutions",
        "header_screenshot",
        "header_symbol_search",
        "header_undo_redo",
        "legend_context_menu",
        "show_hide_button_in_legend",
        "show_interval_dialog_on_key_press",
        "snapshot_trading_drawings",
        "symbol_info",
        "timeframes_toolbar",
        "use_localstorage_for_settings",
        "volume_force_overlay",
        "disable_resolution_rebuild"
      ],
      enabled_features: [
        "dont_show_boolean_study_arguments",
        "hide_last_na_study_output",
        "move_logo_to_main_pane",
        "side_toolbar_in_fullscreen_mode",
        "keep_left_toolbar_visible_on_small_screens",
        "save_chart_properties_to_local_storage",
      ],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      toolbar_bg: "transparent",
      fullscreen: false,
      autosize: true,
      studies_overrides: this.studies_overrides,
      overrides: this.overrides,
    }

  get element() {
    return document.getElementById(this.element_id);
  }

  get chartType() {
    return Number(localStorage.getItem("tradingview.chartType")) || 1;
  }

  mounted() {
    this.renderChart();
    ZSmartModel.on("tradingview-ready", () => {
      this.loading = false;
    });
    ZSmartModel.on("tradingview-rending", () => {
      this.loading = true;
    });
  }

  public iframe() {
    return (this.element.querySelector(`iframe`) as HTMLIFrameElement)
      .contentWindow;
  }

  public async renderChart() {
    TradeController.tradingview.ready = false;
    ZSmartModel.emit("tradingview-rending");

    this.tvWidget = new TradingView.widget(this.widgetOptions);

    const buttons = [
      { title: "Realtime", resolution: "1", chartType: 3 },
      { title: "1min", resolution: "1", chartType: 1 },
      { title: "5min", resolution: "5", chartType: 1 },
      { title: "15min", resolution: "15", chartType: 1 },
      { title: "30min", resolution: "30", chartType: 1 },
      { title: "1hour", resolution: "60", chartType: 1 },
      { title: "4hour", resolution: "240", chartType: 1 },
      { title: "1day", resolution: "1D", chartType: 1 },
      { title: "1week", resolution: "1W", chartType: 1 },
      { title: "1month", resolution: "1M", chartType: 1 }
    ];

    this.tvWidget.onChartReady(() => {
      if (!this.tvWidget) {
        return;
      }

      if (localStorage.getItem("appVersion") != "3.1.0") {
        localStorage.setItem("appVersion", "3.1.0");
        localStorage.removeItem("tradingview.saveState");
      }

      this.headerReady(buttons);
      this.tvWidget.chart().setChartType(this.chartType);
      this.toggleStudy(this.chartType);

      this.createStudy();
      ZSmartModel.emit("tradingview-ready");
      TradeController.tradingview.ready = true;
    });
  }

  public async headerReady(buttons) {
    await this.tvWidget.headerReady();
    for (const config of buttons) {
      const button = this.tvWidget.createButton();
      button.setAttribute("title", config.title);
      button.textContent = config.title;
      button.addEventListener("click", () => {
        if (button.parentElement.classList.contains("actived")) {
          return false;
        }

        const actived_button = this.iframe().document.querySelector(".actived");
        if (actived_button) {
          this.iframe()
            .document.querySelector(".actived")
            .classList.remove("actived");
        }
        if (config.chartType != this.tvWidget.chart().chartType()) {
          this.tvWidget.chart().setChartType(config.chartType);
          this.toggleStudy(config.chartType);
        }
        this.tvWidget.chart().setResolution(config.resolution, () => {});
        TradeController.tradingview.resolution = config.resolution;
        localStorage.setItem("tradingview.chartType", config.chartType);
        button.parentElement.classList.add("actived");
      });
      button.parentElement.classList.remove("actived");
      if (
        config.resolution === this.widgetOptions.interval &&
        config.chartType == this.chartType
      ) {
        button.parentElement.classList.add("actived");
      }
    }
  }

  public async createStudy() {
    const studies: {
      name: string;
      length: number[];
    }[] = [
      {
        name: "Moving Average",
        length: [5]
      },
      {
        name: "Moving Average",
        length: [10]
      },
      {
        name: "Moving Average",
        length: [30]
      },
      {
        name: "Moving Average",
        length: [60]
      }
    ];
    for (const study of studies) {
      const id = await this.tvWidget
        .chart()
        .createStudy(study.name, false, false, study.length, null);
      this.studies.push(id);
    }
  }

  public toggleStudy(chartType: number) {
    const state = chartType == 3 ? false : true;
    for (let i = 0; i < this.studies.length; i++) {
      this.tvWidget
        .chart()
        .getStudyById(this.studies[i])
        .setVisible(state);
    }
  }
}
</script>
