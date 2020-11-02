Transform JSX using webpack and babel

# Initialize the project and Create a package.json file by running following command in terminal

npm init -y

# Setting up Webpack

npm install --save-dev webpack webpack-cli webpack-dev-server

After installing these two packages, you will notice a new addition to our project, the node_modules and devDependencies section in our package.json file.

add the webpack  into the package.json file inside scripts.

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack serve  --config webpack.dev.js  --mode=development",
    "build": "webpack --config webpack.prod.js --mode=production"
}

 Note: webpack.config.js file is splitted into webpack.common.js, webpack.dev.js,webpack.prod.js refer # # Development and Production Setup

# Setting up Babel

install  --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader

We also need to set up our Babel config file, create a new file in the root directory called .babelrc, and write the following configuration to it:

{
    "presets": ["@babel/preset-env", "@babel/preset-react"]
  }


# Install other required dependencies

npm install --save react react-dom   

(add other required dependencies)

# Create a webpack.config.js file in the root directory and write the following configuration for it:

module.exports = {
    entry: {
    app: './src/index.js',
  },
   output: {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'build'),
},
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
   resolve: {
   extensions: ['*', '.js', '.jsx']
 }
};

For every file with a .js or .jsx extension, excluding the node_modules folder and its content, Webpack uses babel-loader to transpile the ES6 code to ES5.

#  To handle any .css  install css loader and  install html loader - Exports HTML as string. HTML is minimized when the compiler demands.  

npm install --save-dev html-loader css-loader 

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
       {
        test: /\.html$/i,
        loader: 'html-loader',
      }
    ]
  }
};

# Install HTML Webpack Plugin - Plugin that simplifies creation of HTML files to serve our bundles and MiniCssExtractPlugin- This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. 

npm install --save-dev html-webpack-plugin 

--usage--
webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
    app: './src/index.js',
  },
   output: {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'build'),
},
   plugins: [new HtmlWebpackPlugin({
    filename: "index.html",
    template: path.join(__dirname, "src", "index.html")
 })]
};

npm install --save-dev mini-css-extract-plugin
--usage--
webpack.config.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  }
};

# Development and Production Setup

separate the production and development specific bits out, also maintain a "common" configuration to keep things DRY. In order to merge these configurations together,  use a utility called webpack-merge

npm install --save-dev webpack-merge

  conversion-jsx
  |- package.json
 - |- webpack.config.js
 + |- webpack.common.js
 + |- webpack.dev.js
 + |- webpack.prod.js
 |- /build
  |- /src
    |- CodeTest.jsx
    |- ContentMain.jsx
    |- index.js
    |- index.html
  |- /node_modules
  |- .babelrc


  webpack.common.js
-----------------------
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

 webpack.dev.js
-----------------
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
  devServer: {
   contentBase: './build',
   compress: true,
   port: 9000
 }
});

webpack.prod.js
------------------
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

  
# Minification

webpack v4+ will minify our code by default in production mode.

TerserWebpackPlugin - This plugin uses terser to minify your JavaScript.

If we are using webpack v5 or above we do not need to install this plugin.

--usage

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

CssMinimizerWebpackPlugin - This plugin uses cssnano to optimize and minify our CSS.

npm install css-minimizer-webpack-plugin --save-dev

onst MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  module: {
    loaders: [
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ]
  }
};

# To create  a build directory with a production build 

npm run build


### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.






