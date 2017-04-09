const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.base.config.js');

config.bail = true;
config.profile = false;
config.devtool = '#source-map';

config.output = {
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/',
  filename: 'urf.[name].[hash].js',
};

config.plugins = config.plugins.concat([
  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),
  new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
]);

config.module.rules = config.module.rules.concat([
  { test: /\.js?$/, loaders: ['babel-loader?forceEnv=bundle'], exclude: /node_modules/ },
]);

module.exports = config;
