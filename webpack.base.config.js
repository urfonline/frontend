const webpack = require('webpack');

const path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(JSON.stringify(NODE_ENV));

const isProduction = process.env.NODE_ENV === 'production';

const env = {
  production: NODE_ENV === 'production',
  staging: NODE_ENV === 'staging',
  test: NODE_ENV === 'test',
  development: NODE_ENV === 'development' || typeof NODE_ENV === 'undefined',
};
env['build'] = (env.production || env.staging)
const extractCSS = new ExtractTextPlugin({
  filename: isProduction ? 'urf.[contenthash].[name].css' : 'style.[name].css',
  allChunks: false,
});

module.exports = {
  target: 'web',

  entry: {
    vendor: ['react', 'react-dom', 'unfetch'],
    main: './src/entry.js',
  },

  output: {
    path: path.resolve(path.join(__dirname, 'build')),
    publicPath: '/assets',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
  },

  resolve: {
    modules: [
      'web_modules',
      'node_modules',
      './src/images',
    ],
    extensions: ['.js', '.svg'],
  },

  plugins: [
    // new BundleAnalyzerPlugin({ analyzerPort: 3999 }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
      __DEV__: env.development,
      __STAGING__: env.staging,
      __PRODUCTION__: env.production,
    }),
    new LodashModuleReplacementPlugin({
      collections: true,
      shorthands: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', minChunks: Infinity }),
    new ChunkManifestPlugin({
      filename: 'manifest.json',
      manifestVariable: 'chunkManifest',
    }),
    new webpack.optimize.CommonsChunkPlugin({ async: true, children: true, minChunks: 2 }),
    new DuplicatePackageCheckerPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    extractCSS,
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre',
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: 'css-loader?importLoaders=1!postcss-loader',
        }),
      },
      {
        test: /\.svg|\.png|\.woff|\.json/,
        use: 'url-loader?limit=10000',
      },
    ],
    noParse: /\.min\.js/,
  },
};



