const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common,  {
  mode:"production",
  output: {
    filename: '[name].bundle.js',
    path: __dirname + '/build'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader",  'sass-loader']
      }
    ]
  },
  plugins: [ new MiniCssExtractPlugin(), new CleanWebpackPlugin ()],

 optimization: {
  minimize: true,
  minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
}
});

  