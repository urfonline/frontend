const webpack = require('webpack');

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(JSON.stringify(NODE_ENV));

const isProduction = process.env.NODE_ENV === 'production';

const env = {
  production: NODE_ENV === 'production',
  staging: NODE_ENV === 'staging',
  test: NODE_ENV === 'test',
  development: NODE_ENV === 'development' || typeof NODE_ENV === 'undefined',
};
env['build'] = (env.production || env.staging);

module.exports = {
  target: 'web',

  entry: {
    main: ['./src/entry.tsx', './src/utils/lazysizesEntry.ts'],
  },

  output: {
    path: path.resolve(path.join(__dirname, 'build')),
    publicPath: '/assets',
    filename: '[name].js',
    chunkFilename: '[chunkName].chunk.js',
  },

  resolve: {
    modules: [
      'web_modules',
      'node_modules',
      './src/images',
    ],
    extensions: ['.tsx', '.ts', '.js', '.svg'],
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
    // new ChunkManifestPlugin({
    //   filename: 'manifest.json',
    //   manifestVariable: 'chunkManifest',
    // }),
    new DuplicatePackageCheckerPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      alwaysWriteToDisk: true,
      inject: true,
      chunks: ['main'],
    }),
    new HtmlWebpackHarddiskPlugin(),
    new MiniCssExtractPlugin({
      filename: isProduction ? 'urf.[name].css' : 'style.[name].css',
      allChunks: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: env.development,
              reloadAll: true
            }
          },
          'css-loader',
          'postcss-loader'
        ],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
      {
        test: /\.(m?)js(x?)$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.svg/,
        use: ['babel-loader', {loader: '@svgr/webpack',         options: {
            svgo: false,
          },}],
      },
      {
        test: /\.png|\.jpg|\.woff/,
        use: 'url-loader?limit=10000',
      },
    ],
  },
};



