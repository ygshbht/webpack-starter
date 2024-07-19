const mode = "development";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const express = require("express");
const path = require("path");
const webpack = require("webpack"); // only add this if you don't have yet
const portfinder = require("portfinder");

require("dotenv").config({ path: "./.env.development" });
require("dotenv").config({ path: "./.env" });

//maybe add subsequent .env.local, etc. files based on prcedense

module.exports = async () => {
  const defaultPort = 3000;
  const port = await portfinder.getPortPromise({ port: defaultPort });

  return {
    // mode defaults to 'production' if not set
    mode: mode,
    entry: "./src/index.ts",
    // entry not required if using `src/index.js` default
    // output not required if using `dist/main.js` default

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },

        {
          test: /\.glsl$/i,
          loader: "html-loader",
        },
        {
          test: /\.html$/i,
          loader: "raw-loader",
        },
      ],
    },

    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".js", ".json"],
    },

    // required if using webpack-dev-server
    devServer: {
      // contentBase: "./dist",

      port,
      setupMiddlewares: (middlewares, devServer) => {
        devServer.app.use(
          "/",
          express.static(path.resolve(__dirname, "./public"))
        );
        return middlewares;
      },
      open: true,
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./template.htm" }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env),
      }),
    ],
  };
};
