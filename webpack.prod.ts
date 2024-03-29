import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';



const config = (env: any): webpack.Configuration => {
  const API_PORT = env ? env.API_PORT : undefined;
  const API_HOST = env ? env.API_HOST : undefined;
  const API_PROTOCOL = env ? env.API_PROTOCOL : undefined;
  return {
    mode: 'production',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.jsx', '.js', '.json', '.css', '.scss']
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(sc|c)ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: { loader: 'file-loader'}
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin({
        template: './src/index.html'
      }),
      new webpack.DefinePlugin({
        'env.API_PORT': API_PORT
          ? JSON.stringify(API_PORT)
          : JSON.stringify('8000'),
        'env.API_HOST': API_HOST
          ? JSON.stringify(API_HOST)
          : JSON.stringify('localhost'),
        'env.API_PROTOCOL': API_PROTOCOL
          ? JSON.stringify(API_PROTOCOL)
          : JSON.stringify('http'),
        'env.NODE_ENV': JSON.stringify('production')
      })
    ]
  };
};
export default config;
