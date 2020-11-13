const webpack = require('webpack');
const path =  require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const createWebpackConfig = (
  supportLegacyBrowsers
) => {

  const config = {
    entry: {
      main: process.env.NODE_ENV === 'development' ? './public/index.tsx' : './src/index.ts',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: `tsconfig${supportLegacyBrowsers ? '.es5': ''}.json`
            }
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: path.join(__dirname, 'public', 'index.html'),
      }),
    ],
  };

  if (supportLegacyBrowsers) {
    const babelOptions = {
      presets: [
        '@babel/preset-react',
        [
          '@babel/preset-env',
          {
            corejs: '3.6',
            useBuiltIns: 'entry',
          },
        ],
      ],
    };

    config.module.rules.unshift({
      test: /\.jsx?$/,
      exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions,
        },
      ],
    });
  }

  return config;
};

module.exports = createWebpackConfig;
