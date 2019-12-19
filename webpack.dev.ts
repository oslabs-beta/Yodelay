import * as webpack from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';


const config = (env: any): webpack.Configuration => {
  const API_PORT = env ? env.API_PORT : undefined;
  const API_HOST = env ? env.API_HOST : undefined;
  const API_PROTOCOL = env ? env.API_PROTOCOL : undefined;
  const NODE_ENV = env ? env.NODE_ENV : "development";
  return {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.jsx', '.js', '.json', '.css']
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'awesome-typescript-loader'
        },
        {
          test: /\.(sc|c)ss$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    // @ts-ignore
    devServer: {
      port: 3000,
      historyApiFallback: true,
      open: false,
      hot: true
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
        'env.NODE_ENV': NODE_ENV
          ? JSON.stringify(NODE_ENV)
          : JSON.stringify('development')
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
export default config;
