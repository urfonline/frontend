const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const config = require('./webpack.base.config.js');

config.bail = true;
config.profile = false;
config.devtool = '#source-map';

config.output = {
  path: './dist',
  publicPath: 'https://du9l8eemj97rm.cloudfront.net/',
  filename: 'union.[name].[hash].js',
};

config.plugins = config.plugins.concat([
  new CleanWebpackPlugin(['dist', 'prototypes/build']),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),
  new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
  new AssetsWebpackPlugin(),
]);

config.module.rules = config.module.rules.concat([
  { test: /\.js?$/, loaders: ['babel-loader?forceEnv=bundle'], exclude: /node_modules/ },
]);

module.exports = config;
