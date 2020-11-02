const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    mode:"development",
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader",  'sass-loader']
          }
        ]
      },
      resolve: {
        extensions: ['*', '.js', '.jsx']
      },
 devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
   compress:true,
   port: 9000
 }
});

  