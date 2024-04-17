import colors from "@/colors";

export default {
  children: {
    ".chart-page": {
      children: {},
      attributes: {
        "background-color": colors["bg-card-color"] + " !important",
      }
    },
    ".chart-page .pane-legend-icon-container svg": {
      children: {},
      attributes: { fill: colors["icon-color"] }
    },
    ".chart-page .tv-side-toolbar .tools-group .button": {
      children: {},
      attributes: {
        "background-color": colors["bg-card-color"],
        "border-color": colors["bg-card-color"]
      }
    },
    ".chart-page .tv-side-toolbar .tools-group .button .main.text-as-icon": {
      children: {},
      attributes: { color: colors["icon-color"] }
    },
    ".chart-page .tv-side-toolbar .tools-group .button svg": {
      children: {},
      attributes: { fill: colors["icon-color"] }
    },
    ".chart-page .tv-side-toolbar .tools-group .button.selected, .chart-page .tv-side-toolbar .tools-group .button:hover, .chart-page .tv-side-toolbar .tools-group .button:active": {
      children: {},
      attributes: {
        "background-color": colors["selected-bg-color"],
        "border-color": colors["selected-bg-color"]
      }
    },
    ".chart-page .tv-side-toolbar .tools-group .button.selected svg, .chart-page .tv-side-toolbar .tools-group .button:hover svg, .chart-page .tv-side-toolbar .tools-group .button:active svg": {
      children: {},
      attributes: { fill: colors["header-text-color"] }
    },
    ".chart-page .tv-side-toolbar .tools-group .button.selected .main.text-as-icon, .chart-page .tv-side-toolbar .tools-group .button:hover .main.text-as-icon, .chart-page .tv-side-toolbar .tools-group .button:active .main.text-as-icon": {
      children: {},
      attributes: { color: colors["header-text-color"] }
    },
    ".chart-page .tv-side-toolbar .tools-group .button.selected .side, .chart-page .tv-side-toolbar .tools-group .button:hover .side, .chart-page .tv-side-toolbar .tools-group .button:active .side": {
      children: {},
      attributes: { "border-left": "1px solid transparent" }
    },
    ".chart-page .tv-side-toolbar .tools-group .button:active svg": {
      children: {},
      attributes: { fill: colors["icon-color"] }
    },
    ".chart-page .charts-popup-list": {
      children: {},
      attributes: {
        "background-color": colors["bg-card-color"],
        color: colors["icon-color"],
        "border-color": colors["selected-bg-color"]
      }
    },
    ".chart-page .charts-popup-list .separator": {
      children: {},
      attributes: { "border-top": "1px solid #b0d6f1" }
    },
    ".chart-page .charts-popup-list .item": {
      children: {},
      attributes: {
        "background-color": colors["bg-card-color"],
        color: colors["icon-color"]
      }
    },
    ".chart-page .charts-popup-list .item.active": {
      children: {},
      attributes: {
        "background-color": colors["selected-bg-color"],
        color: colors["header-text-color"]
      }
    },
    ".chart-page .charts-popup-list .icon-wrap svg": {
      children: {},
      attributes: { fill: colors["icon-color"] }
    },
    ".chart-page .list-inner .item": {
      children: {},
      attributes: { "background-color": colors["bg-card-color"] }
    },
    ".chart-page .list-inner .item.active": {
      children: {},
      attributes: { "background-color": colors["selected-bg-color"] }
    },
    ".chart-page .list-inner .item.active svg": {
      children: {},
      attributes: { fill: colors["header-text-color"] }
    },
    ".chart-page .list-inner .item.active span.title": {
      children: {},
      attributes: { color: colors["header-text-color"] }
    },
    ".chart-page .list-inner .item span.title": {
      children: {},
      attributes: { color: colors["icon-color"] }
    },
    ".chart-page .favored-list-container span:hover": {
      children: {},
      attributes: { "background-color": "#2c3b59" }
    },
    ".chart-page .tv-floating-toolbar": {
      children: {},
      attributes: {
        "background-color": colors["selected-bg-color"],
        "border-color": colors["border-color"]
      }
    },
    ".chart-page .tv-floating-toolbar .tv-floating-toolbar__widget-wrapper .tv-floating-toolbar__drag, .chart-page .tv-floating-toolbar .tv-floating-toolbar__widget-wrapper input": {
      children: {},
      attributes: { "background-color": colors["bg-card-color"] }
    },
    ".chart-page .tv-floating-toolbar .tv-floating-toolbar__widget-wrapper .tv-floating-toolbar__drag svg, .chart-page .tv-floating-toolbar .tv-floating-toolbar__widget-wrapper input svg": {
      children: {},
      attributes: { fill: colors["icon-color"] }
    },
    ".chart-page .tv-floating-toolbar .tv-floating-toolbar__widget-wrapper .tv-floating-toolbar__widget": {
      children: {},
      attributes: { "border-color": colors["bg-card-color"] }
    },
    ".chart-page .tv-floating-toolbar .tv-floating-toolbar__widget-wrapper .tv-floating-toolbar__widget svg": {
      children: {},
      attributes: { fill: colors["icon-color"] }
    },
    ".chart-page .tv-floating-toolbar .tv-floating-toolbar__widget-wrapper .tv-floating-toolbar__widget .bg": {
      children: {},
      attributes: { fill: colors["bg-card-color"] }
    },
    ".chart-page .tv-floating-toolbar .tv-floating-toolbar__widget-wrapper .tv-floating-toolbar__widget:hover .bg": {
      children: {},
      attributes: { fill: colors["selected-bg-color"] }
    },
    ".chart-page .apply-common-tooltip": {
      children: {},
      attributes: {
        "background-color": "transparent",
        border: "1px solid transparent",
        color: colors["icon-color"],
        cursor: "pointer"
      }
    },
    ".chart-page .apply-common-tooltip:before": {
      children: {},
      attributes: { border: "1px solid transparent" }
    },
    ".chart-page .apply-common-tooltip:hover, .chart-page .apply-common-tooltip .js-button-text:hover": {
      children: {},
      attributes: {
        color: colors["header-text-color"] + " !important",
        background: colors["selected-bg-color"],
        "border-color": "transparent !important"
      }
    },
    '.chart-page .apply-common-tooltip:hover [class^="icon-"], .chart-page .apply-common-tooltip .js-button-text:hover [class^="icon-"]': {
      children: {},
      attributes: { color: colors["header-text-color"] + " !important" }
    },
    ".chart-page .apply-common-tooltip:hover svg, .chart-page .apply-common-tooltip .js-button-text:hover svg": {
      children: {},
      attributes: { fill: colors["header-text-color"] + " !important" }
    },
    ".chart-page .actived .apply-common-tooltip": {
      children: {},
      attributes: {
        color: colors["header-text-color"],
        background: colors["selected-bg-color"]
      }
    },
    ".chart-page .apply-common-tooltip svg": {
      children: {},
      attributes: { fill: colors["icon-color"] }
    },
    '.chart-page .apply-common-tooltip svg [class^="background-"]': {
      children: {},
      attributes: { fill: colors["selected-bg-color"], stroke: "transparent" }
    },
    '.chart-page .apply-common-tooltip svg [class^="arrow-"]': {
      children: {},
      attributes: { fill: colors["icon-color"] }
    },
    ".chart-page .layout__area--center": {
      children: {},
      attributes: { background: "transparent" }
    },
    '.chart-page .layout__area--left [class^="drawingToolbar-"]': {
      children: {},
      attributes: { "background-color": "transparent !important" }
    },
    '.chart-page .layout__area--left [class^="drawingToolbar-"] [class^="group-"]': {
      children: {},
      attributes: { "background-color": "transparent !important" }
    },
    '.chart-page .layout__area--left [class^="drawingToolbar-"] [class^="group-"] + [class^="group-"]': {
      children: {},
      attributes: {
        margin: "0",
        "border-top": "1px solid " + colors["selected-bg-color"]
      }
    },
    '.chart-page .layout__area--left [class^="drawingToolbar-"] [class^="inner-"]': {
      children: {},
      attributes: { "background-color": "transparent !important" }
    },
    '.chart-page .layout__area--left [class^="drawingToolbar-"] [class^="scrollTop-"], .chart-page .layout__area--left [class^="drawingToolbar-"] [class^="scrollBot-"]': {
      children: {},
      attributes: { cursor: "pointer" }
    },
    '.chart-page .layout__area--left [class^="drawingToolbar-"] .apply-common-tooltip': {
      children: {},
      attributes: { background: "transparent" }
    },
    '.chart-page .layout__area--left [class^="menuWrap-"]': {
      children: {},
      attributes: { "background-color": colors["selected-bg-color"] }
    },
    '.chart-page .layout__area--left [class^="separator-"]': {
      children: {},
      attributes: { opacity: ".2" }
    },
    '.chart-page .layout__area--top [class^="group-"], .chart-page .layout__area--top [class^="fill-"]': {
      children: {},
      attributes: { background: "transparent" }
    },
    '.chart-page .layout__area--top [class*="isOpened-"]': {
      children: {},
      attributes: {
        background: colors["selected-bg-color"],
        color: colors["header-text-color"] + " !important"
      }
    },
    ".chart-page .layout__area--top .apply-common-tooltip": {
      children: {},
      attributes: { padding: "3px 10px" }
    },
    "@media screen and (max-width: 870px)": {
      children: {
        ".chart-page .layout__area--top .apply-common-tooltip": {
          children: {},
          attributes: { padding: "3px 6px" }
        }
      },
      attributes: {}
    },
    '.chart-page [class^="menuWrap-"] [class*="isActive-"]': {
      children: {},
      attributes: { "background-color": colors["border-color"] }
    },
    '.chart-page [class^="labelRow-"], .chart-page [class^="icon-"]': {
      children: {},
      attributes: { color: colors["icon-color"] + " !important" }
    },
    '.chart-page [class^="labelRow-"] svg, .chart-page [class^="icon-"] svg': {
      children: {},
      attributes: { fill: colors["icon-color"] }
    },
    '.chart-page [class*="isActive-"]:hover [class^="bg-"]': {
      children: {},
      attributes: { background: "rgba(183, 213, 234, 0.1) !important" }
    },
    '.chart-page [class*="isActive-"] [class^="bg-"]': {
      children: {},
      attributes: { background: "rgba(183, 213, 234, 0.1) !important" }
    },
    ".chart-page .chart-controls-bar": {
      children: {},
      attributes: { "background-color": "#0B2636" }
    },
    ".chart-page .chart-container": {
      children: {},
      attributes: {
        "background-color": "transparent",
        border: "1px solid transparent"
      }
    },
    ".chart-page .button": {
      children: {},
      attributes: { "background-color": "#0B2636", "border-color": "#0B2636" }
    },
    ".chart-page .button:hover": {
      children: {},
      attributes: { "background-color": colors["icon-color"] }
    },
    ".chart-page .button.selected, .chart-page .button.active": {
      children: {},
      attributes: { "background-color": colors["icon-color"] + " !important" }
    },
    ".chart-page .button.selected svg, .chart-page .button.active svg": {
      children: {},
      attributes: { fill: "#0B2636" }
    },
    ".scrollBot-2HHpZNuf-, .scrollTop-1eXi8ltS-": {
      children: {},
      attributes: { "background-color": colors["selected-bg-color"] }
    }
  },
  attributes: {}
};
