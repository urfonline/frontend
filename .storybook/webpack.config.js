module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.svg|\.jpg|\.png|\.woff|\.json/,
        use: 'url-loader?limit=10000',
      },
    ],
  },
};
