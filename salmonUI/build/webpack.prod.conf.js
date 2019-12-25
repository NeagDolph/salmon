'use strict';
// const path = require('path')
// const utils = require('./utils')
// const webpack = require('webpack')
// const config = require('../config')
// const merge = require('webpack-merge')
// const baseWebpackConfig = require('./webpack.base.conf')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { VueLoaderPlugin } = require('vue-loader')

// const env = process.env.NODE_ENV === 'testing'
//   ? require('../config/test.env')
//   : require('../config/prod.env')

// const webpackConfig = merge(baseWebpackConfig, {
//   module: {
//     rules: [
//       {
//         test: /\.vue$/,
//         loader: 'vue-loader'
//       },
//       // this will apply to both plain .js files
//       // AND <script> blocks in vue files
//       {
//         test: /\.js$/,
//         loader: 'babel-loader'
//       },
//       // this will apply to both plain .css files
//       // AND <style> blocks in vue files
//       {
//         test: /\.css$/,
//         use: [
//           'vue-style-loader',
//           'css-loader'
//         ]
//       },
//       // this will apply to both plain .scss files
//       // AND <style lang="scss"> blocks in vue files
//       {
//         test: /\.scss$/,
//         use: [
//           'vue-style-loader',
//           'css-loader',
//           {
//             loader: 'sass-loader',
//             options: {
//             }
//           }
//         ]
//       }
//     ]
//   },
//   devtool: config.build.productionSourceMap ? config.build.devtool : false,
//   output: {
//     path: config.build.assetsRoot,
//     filename: utils.assetsPath('js/[name].[chunkhash].js'),
//     chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
//   },
//   plugins: [
//     // http://vuejs.github.io/vue-loader/en/workflow/production.html
//     new VueLoaderPlugin(),
//     new webpack.DefinePlugin({
//       'process.env': env
//     }),
//     new UglifyJsPlugin({
//       uglifyOptions: {
//         compress: {
//           warnings: false
//         }
//       },
//       sourceMap: config.build.productionSourceMap,
//       parallel: true
//     }),
//     // extract css into its own file
//     new ExtractTextPlugin({
//       filename: utils.assetsPath('css/[name].[hash].css'),
//       // Setting the following option to `false` will not extract CSS from codesplit chunks.
//       // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
//       // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
//       // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
//       allChunks: true,
//     }),
//     // Compress extracted CSS. We are using this plugin so that possible
//     // duplicated CSS from different components can be deduped.
//     new OptimizeCSSPlugin({
//       cssProcessorOptions: config.build.productionSourceMap
//         ? { safe: true, map: { inline: false } }
//         : { safe: true }
//     }),
//     // generate dist index.html with correct asset hash for caching.
//     // you can customize output by editing /index.html
//     // see https://github.com/ampedandwired/html-webpack-plugin
//     new HtmlWebpackPlugin({
//       filename: process.env.NODE_ENV === 'testing'
//         ? 'index.html'
//         : config.build.index,
//       template: 'index.html',
//       inject: true,
//       minify: {
//         removeComments: true,
//         collapseWhitespace: true,
//         removeAttributeQuotes: true
//         // more options:
//         // https://github.com/kangax/html-minifier#options-quick-reference
//       },
//       // necessary to consistently work with multiple chunks via CommonsChunkPlugin
//       chunksSortMode: 'dependency'
//     }),
//     // keep module.id stable when vendor modules does not change
//     new webpack.HashedModuleIdsPlugin(),
//     // enable scope hoisting
//     // new webpack.optimize.ModuleConcatenationPlugin(),
//     // split vendor js into its own file
//     // new webpack.optimize.CommonsChunkPlugin({
//     //   name: 'vendor',
//     //   minChunks (module) {
//     //     // any required modules inside node_modules are extracted to vendor
//     //     return (
//     //       module.resource &&
//     //       /\.js$/.test(module.resource) &&
//     //       module.resource.indexOf(
//     //         path.join(__dirname, '../node_modules')
//     //       ) === 0
//     //     )
//     //   }
//     // }),
//     // // extract webpack runtime and module manifest to its own file in order to
//     // // prevent vendor hash from being updated whenever app bundle is updated
//     // new webpack.optimize.CommonsChunkPlugin({
//     //   name: 'manifest',
//     //   minChunks: Infinity
//     // }),
//     // // This instance extracts shared chunks from code splitted chunks and bundles them
//     // // in a separate chunk, similar to the vendor chunk
//     // // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
//     // new webpack.optimize.CommonsChunkPlugin({
//     //   name: 'app',
//     //   async: 'vendor-async',
//     //   children: true,
//     //   minChunks: 3
//     // }),

//     // copy custom static assets
//     new CopyWebpackPlugin([
//       {
//         from: path.resolve(__dirname, '../static'),
//         to: config.build.assetsSubDirectory,
//         ignore: ['.*']
//       }
//     ])
//   ]
// })

// if (config.build.productionGzip) {
//   const CompressionWebpackPlugin = require('compression-webpack-plugin')

//   webpackConfig.plugins.push(
//     new CompressionWebpackPlugin({
//       asset: '[path].gz[query]',
//       algorithm: 'gzip',
//       test: new RegExp(
//         '\\.(' +
//         config.build.productionGzipExtensions.join('|') +
//         ')$'
//       ),
//       threshold: 10240,
//       minRatio: 0.8
//     })
//   )
// }

// if (config.build.bundleAnalyzerReport) {
//   const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//   webpackConfig.plugins.push(new BundleAnalyzerPlugin())
// }

// module.exports = webpackConfig


// webpack.config.js

const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const config = require('./env')
const isProd = process.env.NODE_ENV === 'production';
const utils = require('./utils')
// const commonConfig             = require('./webpack.config.common');

const env = process.env.NODE_ENV;

const wpconfig = {
  devtool: "source-map",
  entry: path.join(__dirname, '..', 'src', 'main.js'),
  mode: env,
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  output: {
    publicPath: '/serve',
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all'
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
        ],
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
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: !isProd
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
  ],
};

module.exports = wpconfig;

// const webpack                  = require('webpack');
// const merge                    = require('webpack-merge');
// const OptimizeCSSAssetsPlugin  = require('optimize-css-assets-webpack-plugin');
// const MiniCSSExtractPlugin     = require('mini-css-extract-plugin');
// const UglifyJSPlugin           = require('uglifyjs-webpack-plugin');
// const CompressionPlugin        = require('compression-webpack-plugin');
// const helpers                  = require('./helpers');
// const commonConfig             = require('./webpack.config.common');
// const isProd                   = process.env.NODE_ENV === 'production';
// const environment              = isProd ? require('./env/prod.env') : require('./env/staging.env');

// const webpackConfig = merge(commonConfig, {
//     mode: 'production',
//     output: {
//         path: helpers.root('dist'),
//         publicPath: '/serve',
//         filename: 'js/[hash].js',
//         chunkFilename: 'js/[id].[hash].chunk.js'
//     },
//     optimization: {
//         runtimeChunk: 'single',
//         minimizer: [
//             new OptimizeCSSAssetsPlugin({
//                 cssProcessorPluginOptions: {
//                     preset: [ 'default', { discardComments: { removeAll: true } } ],
//                 }
//             }),
//             new UglifyJSPlugin({
//                 cache: true,
//                 parallel: true,
//                 sourceMap: !isProd
//             })
//         ],
//         splitChunks: {
//             chunks: 'all',
//             maxInitialRequests: Infinity,
//             minSize: 0,
//             cacheGroups: {
//                 vendor: {
//                     test: /[\\/]node_modules[\\/]/,
//                     name (module) {
//                         const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
//                         return `npm.${packageName.replace('@', '')}`;
//                     }
//                 },
//                 styles: {
//                     test: /\.css$/,
//                     name: 'styles',
//                     chunks: 'all',
//                     enforce: true
//                 }
//             }
//         }
//     },
//     plugins: [
//         new webpack.EnvironmentPlugin(environment),
//         new MiniCSSExtractPlugin({
//             filename: 'css/[name].[hash].css',
//             chunkFilename: 'css/[id].[hash].css'
//         }),
//         new CompressionPlugin({
//             filename: '[path].gz[query]',
//             algorithm: 'gzip',
//             test: new RegExp('\\.(js|css)$'),
//             threshold: 10240,
//             minRatio: 0.8
//         }),
//         new webpack.HashedModuleIdsPlugin()
//     ]
// });

// if (!isProd) {
//     webpackConfig.devtool = 'source-map';

//     if (process.env.npm_config_report) {
//         const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//         webpackConfig.plugins.push(new BundleAnalyzerPlugin());
//     }
// }

// module.exports = webpackConfig;