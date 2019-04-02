const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  let config = {
    module: {
      rules: [
        {
          test: /\.(sc|c)ss$/,
          use: [
            argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: 'main.css',
        chunkFilename: '[id].css'
      })
    ]
  };

  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
    config.devServer = { hot: true };
    config.plugins << new webpack.HotModuleReplacementPlugin();
  }

  return config;
}
