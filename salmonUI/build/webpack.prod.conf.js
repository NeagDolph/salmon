'use strict';
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')
const config = require('./env')
const utils = require('./utils')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const commonConfig             = require('./webpack.config.common');

const env = process.env.NODE_ENV;

console.log("OOP", env)

const wpconfig = {
  entry: path.join(__dirname, '..', 'src', 'main.js'),
  mode: env,
  // resolve: {
  //   extensions: ['*', '.js', '.vue', '.json'],
  //   alias: {
  //     'vue$': 'vue/dist/vue.min.js'
  //   }
  // },
  output: {
    publicPath: process.env.NODE_ENV == 'production' ? '/' : '/dist',
    filename: 'build.js',
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all'
    },
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
           MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[hash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),

    new HtmlWebpackPlugin({
      filename: path.join(__dirname, '..', 'dist', 'index.html'),
      template: path.join(__dirname, '..', 'static', 'index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ]
};

module.exports = wpconfig;