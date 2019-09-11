const utils = require('./utils');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack')
const merge = require('webpack-merge');

const config = {
  output: {
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '@': utils.resolve('src'),
      '@@': utils.resolve('src/options_page')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [utils.resolve('src')]
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  externals: {
    browser: 'browser',
    chrome: 'chrome'
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEBUG__: process.env.NODE_ENV !== 'production'
    })
  ]
};

let _config;

if (process.env.NODE_ENV === 'production') {
  _config = merge.smart(config, {
    plugins: [
      new UglifyJsPlugin()
    ]
  });
} else {
  _config = merge.smart(config, {
    devtool: 'inline-source-map'
  });
}

module.exports = _config;
