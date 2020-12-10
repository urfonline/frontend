const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.base.config.js');

if (process.env.NODE_ENV !== 'test') {

}

config.devServer = {
  historyApiFallback: true,

  proxy: {
    '/api': {
      target: 'http://localhost:4444',
      secure: false,
      pathRewrite: {'^/api' : ''}
    }
  }
};

config.watchOptions = {
  ignored: /node_modules/
}

config.mode = 'development';
config.output = {
  path: path.resolve('./build'),
  publicPath: '/assets/',
  filename: '[name].js',
  chunkFilename: '[name].js',
};

config.devtool = 'inline-source-map';

config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    URF_API_URL: JSON.stringify("http://localhost:8000"),
    URF_IMG_ROOT: JSON.stringify("http://localhost:8000/media/"),
  })
]);

config.module.rules = config.module.rules.concat([
  { test: /\.js?$/, loaders: ['babel-loader?cacheDirectory&envName=bundle'], exclude: /node_modules/ },
]);

module.exports = config;
