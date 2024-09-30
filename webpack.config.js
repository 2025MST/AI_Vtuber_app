const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
        },{
            test: /\.(png|svg|jpg|gif|model3|json)$/,
            use: ['file-loader'],
        }
        ]
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify')
        },
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',  // テンプレートHTMLファイル
            inject: 'body',  // bodyタグの最後に挿入
            scriptLoading: 'defer',
            // カスタムスクリプトを手動で追加
            templateParameters: {
                scripts: [
                    './lib/live2d.min.js',
                    './lib/live2dcubismcore.min.js',
                ]
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'public/lib', to: 'lib'}
            ]
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        contentBase: path.join(__dirname, 'app/build'),
        compress: true,
        port: 9000
    }
};
