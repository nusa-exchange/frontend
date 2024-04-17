<template>
  <div :id="element_id"></div>
</template>

<script lang="ts">
import colors from "@/colors";
import ApiClient from "@/library/z-apiclient";
import uuid from "uuid/v4";
import ZSmartModel from "@/library/z-eventbus";
import { init, Chart, KLineData } from "klinecharts";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class KlineChart extends Vue {
  @Prop() readonly market_id!: string;
  @Prop() readonly period!: number;

  chart!: Chart;
  element_id = uuid();
  old_load_more_time = new Date().getTime();

  get market() {
    return this.PublicController.markets.find(market => market.id == this.market_id)
  }

  mounted() {
    this.chart = init(this.element_id);

    this.chart.createTechnicalIndicator("VOL", false, { height: 75 });
    this.chart.createTechnicalIndicator("MACD", false, { height: 50 });
    this.chart.overrideTechnicalIndicator({
      name: "VOL",
      calcParams: [],
      styles: {
        bar: {
          upColor: colors["up-color"],
          downColor: colors["down-color"],
          noChangeColor:'#888888'
        },
        line: {
          size: 1,
          colors: ['#FF9600','#9D65C9','#2196F3','#E11D74','#01C5C4']
        },
        circle: {
          upColor: colors["up-color"],
          downColor: colors["down-color"],
          noChangeColor:'#888888'
        }
      }
    })

    this.chart.setPriceVolumePrecision(
      this.market.price_precision,
      this.market.amount_precision > 2 ? 2 : this.market.amount_precision
    );

    this.chart.setStyleOptions({
      grid: {
        show: true,
        horizontal: {
          show: true,
          size: 1,
          color: colors["bg-head-color"],
          // 'solid'|'dash'
          style: 'dash',
          dashValue: [4, 4]
        },
        vertical: {
          show: true,
          size: 1,
          color: colors["bg-head-color"],
          // 'solid'|'dash'
          style: 'dash',
          dashValue: [4, 4]
        }
      },
      candle: {
        margin: {
          top: 0.2,
          bottom: 0.1
        },
        // 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
        type: 'candle_solid',
        bar: {
          upColor: colors["up-color"],
          downColor: colors["down-color"],
          noChangeColor: '#888888'
        },
        area: {
          lineSize: 2,
          lineColor: '#2196F3',
          value: 'close',
          fillColor: [{
            offset: 0,
            color: 'rgba(33, 150, 243, 0.01)'
          }, {
            offset: 1,
            color: 'rgba(33, 150, 243, 0.2)'
          }]
        },
        priceMark: {
          show: true,
          high: {
            show: true,
            color: '#D9D9D9',
            textMargin: 5,
            textSize: 10,
            textWeight: 'normal'
          },
          low: {
            show: true,
            color: '#D9D9D9',
            textMargin: 5,
            textSize: 10,
            textWeight: 'normal',
          },
          last: {
            show: true,
            upColor: colors["up-color"],
            downColor: colors["down-color"],
            noChangeColor: '#888888',
            line: {
              show: true,
              // 'solid'|'dash'
              style: 'dash',
              dashValue: [4, 4],
              size: 1
            },
            text: {
              show: true,
              size: 8,
              paddingLeft: 2,
              paddingTop: 2,
              paddingRight: 2,
              paddingBottom: 2,
              color: '#FFFFFF',
              weight: 'normal'
            }
          }
        },
        tooltip: {
          showRule: 'follow_cross',
          showType: 'rect',
          labels: [
            'Time: ',
            'Open: ',
            'Close: ',
            'High: ',
            'Low: ',
            'Volume: ',
          ],
          values: null,
          defaultValue: 'n/a',
          rect: {
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 6,
            offsetLeft: 8,
            offsetTop: 8,
            offsetRight: 8,
            borderRadius: 0,
            borderSize: 1,
            borderColor: colors["border-color"],
            fillColor: colors["bg-card-head-color"]
          },
          text: {
            size: 8,
            color: '#fff',
            marginLeft: 8,
            marginTop: 6,
            marginRight: 8,
            marginBottom: 0
          }
        }
      },
      technicalIndicator: {
        margin: {
          top: 0.2,
          bottom: 0.1
        },
        bar: {
          upColor: colors["up-color"],
          downColor: colors["down-color"],
          noChangeColor: '#888888'
        },
        line: {
          size: 1,
          colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4']
        },
        circle: {
          upColor: colors["up-color"],
          downColor: colors["down-color"],
          noChangeColor: '#888888'
        },
        lastValueMark: {
          show: false,
          text: {
            show: false,
            color: '#ffffff',
            size: 8,
            weight: 'normal',
            paddingLeft: 3,
            paddingTop: 2,
            paddingRight: 3,
            paddingBottom: 2
          }
        },
        tooltip: {
          showRule: 'follow_cross',
          showName: false,
          showParams: false,
          defaultValue: 'n/a',
          text: {
            size: 8,
            weight: 'normal',
            color: '#D9D9D9',
            marginTop: 6,
            marginRight: 8,
            marginBottom: 0,
            marginLeft: 8
          }
        }
      },
      xAxis: {
        show: true,
        height: null,
        axisLine: {
          show: true,
          color: colors["border-color"],
          size: 1
        },
        tickText: {
          show: true,
          color: colors["color-gray"],
          size: 8,
          paddingTop: 2,
          paddingBottom: 6
        },
        tickLine: {
          show: true,
          size: 1,
          length: 3,
          color: colors["border-color"]
        }
      },
      yAxis: {
        show: true,
        width: null,
        // 'left' | 'right'
        position: 'right',
        // 'normal' | 'percentage'
        type: 'normal',
        inside: false,
        axisLine: {
          show: true,
          color: colors["border-color"],
          size: 1
        },
        tickText: {
          show: true,
          color: colors["color-gray"],
          size: 8,
          paddingLeft: 3,
          paddingRight: 6
        },
        tickLine: {
          show: true,
          size: 1,
          length: 3,
          color: colors["border-color"]
        }
      },
      separator: {
        size: 1,
        color: colors["border-color"],
        fill: true,
        activeBackgroundColor: 'rgba(230, 230, 230, .15)'
      },
      crosshair: {
        show: true,
        horizontal: {
          show: true,
          line: {
            show: true,
            // 'solid'|'dash'
            style: 'dash',
            dashValue: [4, 2],
            size: 1,
            color: colors["color-gray"]
          },
          text: {
            show: true,
            color: '#fff',
            size: 8,
            weight: 'normal',
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 2,
            paddingBottom: 2,
            borderSize: 0,
            borderColor: colors["disabled-color"],
            backgroundColor: colors["disabled-color"]
          }
        },
        vertical: {
          show: true,
          line: {
            show: true,
            // 'solid'|'dash'
            style: 'dash',
            dashValue: [4, 2],
            size: 1,
            color: colors["color-gray"]
          },
          text: {
            show: true,
            color: '#fff',
            size: 8,
            weight: 'normal',
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 4,
            paddingBottom: 2,
            borderSize: 0,
            borderColor: colors["disabled-color"],
            backgroundColor: colors["disabled-color"]
          }
        }
      },
      graphicMark: {
        line: {
          color: '#2196F3',
          size: 1
        },
        point: {
          backgroundColor: '#2196F3',
          borderColor: '#2196F3',
          borderSize: 1,
          radius: 4,
          activeBackgroundColor: '#2196F3',
          activeBorderColor: '#2196F3',
          activeBorderSize: 1,
          activeRadius: 6
        },
        polygon: {
          stroke: {
            size: 1,
            color: '#2196F3'
          },
          fill: {
            color: 'rgba(33, 150, 243, 0.1)'
          }
        },
        arc: {
          stroke: {
            size: 1,
            color: '#2196F3'
          },
          fill: {
            color: 'rgba(33, 150, 243, 0.1)'
          }
        },
        text: {
          color: '#fff',
          size: 8,
          marginLeft: 2,
          marginRight: 2,
          marginTop: 2,
          marginBottom: 0
        }
      },
      annotation: {
        symbol: {
          // 'diamond' | 'circle' | 'rect' | 'triangle' | 'custom' | 'none'
          type: 'diamond',
          // 'top' | 'bottom' | 'point'
          position: 'top',
          size: 8,
          color: '#1e88e5',
          activeSize: 10,
          activeColor: '#FF9600',
          offset: [0, 20]
        }
      }
    });

    this.get_chart_data();

    this.chart.loadMore(timestamp => {
      if (typeof timestamp !== "number") return;
      if (timestamp >= this.old_load_more_time) return;
      this.old_load_more_time = timestamp;

      this.get_chart_data(timestamp / 1000);
    });

    window.addEventListener("resize", () => {
      this.chart.resize();
    });

    ZSmartModel.on("new-trade", (trade: ZTypes.PublicTrade) => {
      const first_data = this.chart_data_list().length === 0;
      if (first_data) return;
      const now_data = this.chart_data_list()[this.chart_data_list().length - 1];

      let resolution: number | string = this.TradeController.tradingview.resolution;

      if (resolution.includes("D")) {
        resolution = 1440;
      } else if (resolution.includes("W")) {
        resolution = 10080;
      } else {
        resolution = Number(resolution);
      }
      const coeff = resolution * 60;

      const kline = {
        timestamp: Math.floor(trade.created_at / coeff) * coeff * 1000,
        open: first_data ? Number(trade.price) : now_data.open,
        high: first_data ? Number(trade.price) : (Number(trade.price) > now_data.high ? Number(trade.price) : now_data.high),
        low: first_data ? Number(trade.price) : (Number(trade.price) < now_data.low ? Number(trade.price) : now_data.low),
        close: Number(trade.price),
        volume: now_data.volume + Number(trade.amount)
      };

      if (kline.timestamp > now_data.timestamp) {
        kline.open = Number(trade.price);
        kline.high = Number(trade.price);
        kline.low = Number(trade.price);
        kline.volume = Number(trade.amount);
      }

      this.apply_chart_data([kline]);
    })
  }

  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.chart.resize();
    });
  }

  chart_data_list() {
    return this.chart.getDataList();
  }

  chart_first_data() {
    return this.chart_data_list()[0];
  }

  async get_chart_data(
    time_to = (new Date().getTime() / 1000).toFixedNumber(0),
    time_from?,
    limit = 100
  ) {
    try {
      const { data } = await new ApiClient("trade").get(
        `public/markets/${this.market_id}/k-line`,
        {
          period: this.period,
          time_from,
          time_to,
          limit: limit
        }
      );

      if (!data.length) return;

      const kline_data: KLineData[] = data.map((kline: number[]) => ({
        timestamp: kline[0] * 1000,
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5]
      }));

      this.apply_chart_data(kline_data);
    } catch (error) {
      return error;
    }
  }

  apply_chart_data(kline_data: KLineData[]) {
    const first_data = this.chart_data_list().length === 0;

    if (first_data) {
      this.chart.applyNewData(kline_data);
    } else if (kline_data[kline_data.length - 1].timestamp == this.chart_data_list()[this.chart_data_list().length - 1].timestamp) {
      kline_data.forEach(kline => {
        this.chart.updateData(kline);
      });
    } else if (kline_data[0].timestamp > this.chart_data_list()[this.chart_data_list().length - 1].timestamp) {
      this.chart.applyNewData([...this.chart_data_list(), ...kline_data], true);
    } else {
      this.chart.applyMoreData(kline_data, true);
    }
  }

  @Watch("period")
  onPeriodChanged() {
    this.chart.clearData();
    this.get_chart_data();
  }
}
</script>
