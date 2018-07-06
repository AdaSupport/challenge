var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// creates an index.html at the specified location and injects webpack bundle.js into it
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, 'src/index.html'),
  filename: 'index.html',
  inject: 'body'
});

// converts .styl into .css
var stylusLoader = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: 'css-loader!stylus-loader'
});

// webpack config
module.exports = {
  entry: [
    './src/index.jsx',
    './src/styles/app.styl'
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    loaders: [
      { test: /\.jsx$/, include: path.join(__dirname, 'src'), loader: 'babel-loader' },
      { test: /\.styl$/, include: path.join(__dirname, 'src'), loader: stylusLoader }
    ]
  },
  plugins: [HTMLWebpackPluginConfig, new ExtractTextPlugin('app.css')]
};
