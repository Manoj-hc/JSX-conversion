const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
  },
  module: {
    rules: [
      {
         test: /\.(js|jsx)$/,
         exclude: /node_modules/,
         use: {
           loader: "babel-loader"
         }
       },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      }
    ]
  },
  resolve: {
   extensions: ['*', '.js', '.jsx']
 },
 plugins: [new HtmlWebpackPlugin({
  filename: "index.html",
  template: path.join(__dirname, "src", "index.html")
})],
 output: {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'build'),
}
};

  