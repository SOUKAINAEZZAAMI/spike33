//exposes the marketing app 
const packageJson = require('../package.json');

const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin =
require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const devConfig = {
mode: 'development',
output: {
publicPath: 'http://localhost:8081/',
},
devServer: {
port: 8081,
historyApiFallback: {
index: 'index.html',
},
},
plugins: [
new ModuleFederationPlugin({
name: 'marketing',
filename: 'remoteEntry.js',
exposes: {
'./MarketingApp': './src/bootstrap',
},
shared: packageJson.dependencies,
}),
new HtmlWebpackPlugin({
template: './public/index.html',
}),
],
resolve: {
  fallback: {
    "crypto": false,
    "net": false,
    "tls": false,
    "zlib": require.resolve("browserify-zlib"),
    "stream": require.resolve("stream-browserify")
  }
}




};
module.exports = merge(commonConfig, devConfig);




/*const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');

const devConfig = {
  mode: 'development',
  devServer: {
    port: 8081,
    historyApiFallback: {
      index: 'index.html',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);*/