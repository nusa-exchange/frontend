/* eslint-disable no-useless-escape */
const webpack = require("webpack");
const path = require("path");
const PostCompilePlugin = require("webpack-post-compile-plugin");
const TransformModulesPlugin = require("webpack-transform-modules-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const isProduction = process.env.NODE_ENV === "production";

const configWebPack = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    config.plugins.delete('pwa');
    config.plugins.delete('workbox');
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          "info-color": "var(--info-color)",
          "warning-color": "var(--warning-color)",
          "error-color": "var(--down-color)",
          "success-color": "var(--up-color)",
          "link-color": "var(--blue-color)",
          "link-hover-color": "#22a3ff",
          "link-active-color": "#22a3ff",
          "link-hover-decoration": "#22a3ff",
          "text-color": "#fff",
          "component-background": "var(--bg-head-color)",
          "text-color-secondary": "var(--color-gray)",
          "border-color-base": "var(--border-color)",
          "border-color-split": "var(--bg-downdown-border-color)",
          "border-color-inverse": "var(--bg-downdown-border-color)",
          "heading-color": "#fff",
          "disabled-color": "hsla(0,0%,100%,.35)",
          "item-active-bg": "hsla(0,0%,100%,.05)",
          "item-hover-bg": "hsla(0,0%,100%,.05)"
        },
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: smp.wrap({
    devtool:
      process.env.NODE_ENV === "development" ? "inline-source-map" : false,
    resolve: {
      alias: {
        "cube-ui-src": path.resolve(__dirname, "node_modules/cube-ui/src"),
        "cube-ui": "cube-ui/lib"
      },
      extensions: ["*", ".js", ".ts", ".tsx", ".vue", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: "sass-loader",
              options: {}
            },
            {
              loader: "@epegzz/sass-vars-loader",
              options: {
                syntax: "scss",
                files: [path.resolve(__dirname, "src/colors.ts")]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new PostCompilePlugin(),
      new TransformModulesPlugin(),
      new PreloadWebpackPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  }),
  productionSourceMap: false,
  devServer: {
    proxy: {
      "^/api": {
        target: "https://www.nusa.live/",
        secure: false,
        ws: true,
        changeOrigin: true,
        onError(err) {
          console.log('Suppressing WDS proxy upgrade error:', err);
        },
      }
    },
    host: "0.0.0.0",
    port: 3000,
    hot: true,
    disableHostCheck: true
  }
};

if (isProduction) {
  configWebPack.configureWebpack.plugins.push(
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CompressionPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  );
}

module.exports = configWebPack;
