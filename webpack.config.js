const isProduction = process.env.NODE_ENV === 'production';
const config = isProduction ? require('./webpack.prod.config.js') : require('./webpack.dev.config.js');

module.exports = config;
