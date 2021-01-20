const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
//   entry: ['babel-polyfill', 'react-hot-loader/patch', './src/index'],
  entry: ['react-hot-loader/patch', './src/index'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        include: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [['env', {es2015: {modules: process.env.ENV === 'production' ? 'commonjs' : false}}], 'react'],
          plugins: ['transform-decorators-legacy', 'transform-object-rest-spread', 'transform-class-properties', 'react-hot-loader/babel'],
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'eslint-loader',
        options: {
          fix: true
        },
      },
      {
          test: /\.css$/,
        //   include: /node_modules/,
          loader:  'style!css'
      },
      {
        test: /\.(scss)$/,
        use: [{
          loader: 'style-loader', // inject CSS to page
        }, {
          loader: 'css-loader', // translates CSS into CommonJS modules
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            plugins() { // post css plugins, can be exported to postcss.config.js
              return [
                require('precss'),
                require('autoprefixer'),
              ];
            },
          },
        }, {
          loader: 'sass-loader', // compiles SASS to CSS
        }],
      },     
      {
        test: /\.(eot|png|jpg|svg|ttf|woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },      
      {
          test: /\.json$/,
          loader: 'json-loader'
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets/' }
    ])
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
