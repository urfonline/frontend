const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

config.bail = true;
config.profile = false;
config.devtool = '#source-map';

config.mode = 'production';
config.output = {
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/',
  filename: 'urf.[name].[hash].js',
  chunkFilename: 'urf.[name].[hash].js',
};

config.plugins = config.plugins.concat([
  // new ChunkManifestPlugin({
  //   filename: 'manifest.json',
  //   manifestVariable: 'webpackManifest',
  //   inlineManifest: false
  // }),
  new AssetsPlugin(),
  new CopyWebpackPlugin([
    { from: './src/root', to: './'}
  ]),
]);

config.optimization = { minimizer: [new UglifyJsPlugin()] };

config.module.rules = config.module.rules.concat([
  { test: /\.js?$/, loaders: ['babel-loader?envName=bundle'], exclude: /node_modules/ },
]);

module.exports = config;
