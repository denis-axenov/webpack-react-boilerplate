const path = require('path');
const Sass = require('sass');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');


module.exports = (env, argv) => {

    const resolveDir = (dir) => path.resolve(__dirname, dir);
    const buildFolder = resolveDir('dist');
    const isProduction = argv.mode === 'production';

    return {
        target: 'web',
        devtool: !isProduction && 'source-map',
        entry: [
            resolveDir('src/index.tsx'),
            resolveDir('src/styles/main.scss')
        ],
        output: {
            filename: 'bundle.js',
            path: buildFolder
        },
        resolve: {
            extensions: [
                '.js',
                '.jsx',
                '.ts',
                '.tsx'
            ],
            alias: {
                '@images': resolveDir('src/images'),
                '@fonts': resolveDir('src/fonts'),
                '@scripts': resolveDir('src/scripts'),
                '@styles': resolveDir('src/styles')
            }
        },
        module: {
            rules: [
                {
                    test: /\.[t|j]sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader'
                    }
                },
                {
                    test: /\.scss$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isProduction
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: isProduction,
                                postcssOptions: {
                                    plugins: [
                                        'autoprefixer',
                                        'postcss-preset-env',
                                        ...(isProduction ? ['cssnano'] : [])
                                    ]
                                }
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isProduction,
                                implementation: Sass
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
                    type: 'asset/resource',
                    exclude: resolveDir('src/images'),
                    generator: {
                        filename: 'fonts/[name][ext]'
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/resource',
                    exclude: resolveDir('src/fonts'),
                    generator: {
                        filename: 'images/[name][ext]'
                    }
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'bundle.css'
            }),
            new HtmlWebpackPlugin({
                templateContent:  `<div id="root"></div>`,
                inject: 'body',
                meta: {
                    viewport: "width=device-width, initial-scale=1.0"
                }
            }),
            ...(isProduction || env.lint ? [
                new StylelintPlugin(),
                new ESLintPlugin({
                    configType: 'flat'
                }),
            ] : []),
            ...(isProduction ? [
                new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns: [
                        buildFolder
                    ]
                })
            ] : [])
        ],
        optimization: {
            minimize: isProduction
        },
        stats: 'minimal',
        devServer: {
            static: {
                directory: buildFolder
            },
            compress: isProduction,
            port: 9000,
            watchFiles: [
                './src/*.html'
            ],
            hot: true,
            open: true
        }
    }
}