const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const packageJson = require('./package.json');

module.exports = (env) => {
  return {
    mode: 'production',
    entry: {
      content: './src/js/content',
      popup: './src/js/popup',
    },
    output: {
      filename: 'js/[name].js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: './src/manifest_' + env.browser + '.json',
            to: './manifest.json',
            transform(content) {
              return content
                .toString()
                .replace('__VERSION__', packageJson.version);
            },
          },
          {
            from: './src/_locales',
            to: './_locales',
          },
          {
            from: './src/images',
            to: './images',
          },
          {
            from: './src/html',
            to: './html',
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: `css/[name].css`,
      }),
    ],
    resolve: {
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
    },
  };
};
