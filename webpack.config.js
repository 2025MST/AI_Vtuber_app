const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './app/src/index.js',  // Reactエントリーポイント
    output: {
        path: path.resolve(__dirname, 'app/build'),  // ビルド出力先
        filename: 'bundle.js'
    },
    module: {
        rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
            loader: 'babel-loader'
            }
        }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: './app/public/index.html'  // テンプレートHTMLファイル
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'app/build'),
        compress: true,
        port: 9000
    }
};
