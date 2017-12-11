const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

config.bail = true;
config.profile = false;
config.devtool = '#source-map';

config.output = {
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/',
  filename: 'urf.[name].[hash].js',
  chunkFilename: 'urf.[name].[chunkhash].js',
};

config.plugins = config.plugins.concat([
  new AssetsPlugin(),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),
  new CopyWebpackPlugin([
    { from: './src/root', to: './'}
  ]),
  new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
]);

config.module.rules = config.module.rules.concat([
  { test: /\.js?$/, loaders: ['babel-loader?forceEnv=bundle'], exclude: /node_modules/ },
]);

module.exports = config;
