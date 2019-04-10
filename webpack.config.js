const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env, argv) => {
  console.log(process.env.PATH);

  let config = {
    module: {
      rules: [
        { test: /\.(sc|c)ss$/,
          use: argv.mode === 'production'
            ? [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            : ['vue-style-loader', 'css-loader', 'sass-loader' ]
        },
        {
          test: /\.js$/,
          exclude: file => (
            /node_modules/.test(file) &&
            !/\.vue\.js/.test(file)
          ),
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
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
      }),
      new webpack.DefinePlugin({
        API_URL: JSON.stringify(process.env.API_URL)
      })
    ]
  };

  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
    config.devServer = { hot: true };
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (argv.mode === 'production') {
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          parallel: true,
        })
      ]
    };
    config.plugins.push(new CompressionPlugin());
  }

  return config;
}
