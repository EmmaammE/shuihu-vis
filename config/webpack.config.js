var HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require("webpack-merge");

const parts = require('./webpack.parts')
var package = require('../package.json');
var path = require("path");

const commonConfig = merge([
    {
        entry: {
                vendor: Object.keys(package.dependencies),
                app: "./src/index.js",
        },
        output: {
            path: path.join(__dirname, "../dist/"),
            filename: "[name].bundle.js",
        },
        watch: true,
        resolve: {
            extensions: [".js", ".ts"]
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                title: 'My Awesome application',
                myPageHeader: 'Hello World',
                template: './public/index.html',
                chunks: ['vendor', 'shared', 'app'],
                path: path.join(__dirname, "../dist/"),
                filename: 'index.html'
            }),
        ]
    },
    parts.loadCSS(),
])

const productionConfig = merge([]);

const developmentConfig = merge([
    parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT,
    }),
]);

module.exports = mode => {
    if (mode === "production") {
        return merge(commonConfig, productionConfig, {
            mode
        });
    }

    return merge(commonConfig, developmentConfig, {
        mode
    });
};