const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.base.config.js');

if (process.env.NODE_ENV !== 'test') {

}

config.devServer = {
  historyApiFallback: true,
};

config.output = {
  path: path.resolve('./build'),
  publicPath: '/assets/',
  filename: '[name].js',
  chunkFilename: '[id].chunk.js',
};

config.devtool = 'inline-source-map';

config.plugins = config.plugins.concat([
  new webpack.NoEmitOnErrorsPlugin(),
]);

config.module.rules = config.module.rules.concat([
  { test: /\.js?$/, loaders: ['babel-loader?cacheDirectory&forceEnv=bundle'], exclude: /node_modules/ },
]);

module.exports = config;
