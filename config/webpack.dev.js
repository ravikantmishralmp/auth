// auth/webpack.config.js
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common');
const packageJson = require('./../package.json');

const path = require('path');

const devConfig = {
  entry: './src/index.tsx',
  mode: 'development',
  devServer: {
    historyApiFallback: true, 
    port: 3001,
    hot: true,  // Enable hot module replacement
    watchFiles: ['src/**/*'], // Watches files in the src directory
  },
  output: {
    publicPath: 'http://localhost:3001/',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: {
        './AuthApp': './src/bootstrap',
      },
      shared: {
        react: { singleton: true, requiredVersion: packageJson.dependencies.react },
        'react-dom': { singleton: true, requiredVersion: packageJson.dependencies['react-dom'] },
        '@mui/material': { singleton: true, requiredVersion: packageJson.dependencies['@mui/material'] },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
