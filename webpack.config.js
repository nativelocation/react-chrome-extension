var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    entry: {
        content: './src/content_script/js/index.js',
        background: './src/background_script/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name]_script.js'
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'src/static/**/*', flatten: true }
      ]),
      new JavaScriptObfuscator ({
        rotateUnicodeArray: true
      })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
              test: /\.css$/,
              use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: process.env.NODE_ENV != 'prod' && 'source-map'
};