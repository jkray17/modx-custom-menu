/**
 * @author      delphinpro <delphinpro@gmail.com>
 * @copyright   copyright © 2017 delphinpro
 * @license     licensed under the MIT license
 */

// const fs                   = require('fs');
const path                 = require('path');
const webpack              = require('webpack');
const VueLoaderPlugin      = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin       = require('uglifyjs-webpack-plugin');
// const cfg                  = require('./gulp.config.js');
// const pkg                  = require('./package.json');

global.development = true;

const nodeEnv          = global.development ? 'development' : 'production';
const cssLoaderOptions = {minimize: false, url: false};

let webpackConfig = {
    mode     : nodeEnv,
    watch    : global.development,
    cache    : global.development,
    context  : path.resolve(__dirname, 'src'),
    entry    : {
        index: './index.js',
    },
    output   : {
        path      : path.join(__dirname, 'dist'),
        publicPath: '',
        filename  : '[name].bundle.js',
    },
    devtool  : global.development ? 'source-map' : null,
    module   : {
        rules: [
            {
                test: /\.css$/,
                use : [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: cssLoaderOptions},
                ],
            },
            {
                test: /\.scss$/,
                use : [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: cssLoaderOptions},
                    {loader: 'sass-loader'},
                ],
            },
            {
                test   : /\.js$/,
                loader : 'babel-loader',
                exclude: function(file) {
                    return /node_modules/.test(file)
                        //   && !/\.vue\.js/.test(file)
                        ;
                },
            },
            {
                test  : /\.vue$/,
                loader: 'vue-loader',
            },
        ],
    },
    resolve  : {
        modules   : ['node_modules'],
        extensions: ['.js', '.vue'],
        // alias     : {'vue$': 'vue/dist/vue.esm.js'},
    },
    externals: {
        vue: 'Vue',
    },
    plugins  : [
        new webpack.NoEmitOnErrorsPlugin(),

        new VueLoaderPlugin(),

        new MiniCssExtractPlugin({
            filename: '[name].bundle.css',
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(nodeEnv),
        }),
    ],
};

if (!global.development) {
    webpackConfig.plugins.push(new UglifyJsPlugin({
        sourceMap    : false,
        parallel     : true,
        uglifyOptions: {
            warnings: false,
            output  : {
                comments: /^\**!|@preserve/,
            },
        },
    }));
}

module.exports = webpackConfig;
