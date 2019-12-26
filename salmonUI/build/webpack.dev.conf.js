'use strict';
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const webpack = require('webpack')
const utils = require('./utils')

const env = process.env.NODE_ENV;

const wpconfig = {
  devtool: "cheap-module-eval-source-map",
  entry: path.join(__dirname, '..', 'src', 'main.js'),
  mode: env,
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: 'localhost',
    port: 8081,
    open: false,
    overlay: { warnings: false, errors: true },
    publicPath: "/",
    proxy: {},
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, '..', 'src')],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': require('./env/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      filename: path.join(__dirname, '..', 'dist', 'index.html'),
      template: path.join(__dirname, '..', 'static', 'index.html'),
      inject: true,
    }),
  ]
};

wpconfig.plugins.push(new FriendlyErrorsPlugin({
  compilationSuccessInfo: {
    messages: [`Your application is running here: http://${wpconfig.devServer.host}:${wpconfig.devServer.port}`],
  },
  onErrors: utils.createNotifierCallback()
}))

module.exports = wpconfig