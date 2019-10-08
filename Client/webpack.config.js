const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

process.env.NODE_ENV  = process.env.NODE_ENV || "development";

if(process.env.NODE_ENV === "test"){

  require("dotenv").config({path: ".env"});

}else if(process.env.NODE_ENV === "development"){

  require("dotenv").config({path: ".env.development"});

}

module.exports = (envType) => {
    const isProduction = envType === "production";
    const CSSExtract = new ExtractTextPlugin("styles.css");

    // call dotenv and it will return an Object with a parsed key 
    const env = require("dotenv").config().parsed;
    
    // reduce it to a nice object, the same as before
    const envKeys = Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, {});

    return {
      entry: './src/app.js',
      output: {
        path: path.join(__dirname, 'public', 'dist'),
        filename: 'bundle.js'
      },
      module: {
        rules: [{
          loader: 'babel-loader',
          test: /\.js$/,
          exclude: /node_modules/
        }, {
          test: /\.s?css$/,
          use: CSSExtract.extract({
            use: [
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: true
                  }
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true
                  }
                }
              ]
          })
        },
        {
          test: /\.svg$/,
          loaders: [
            'babel-loader',
            {
              loader: 'react-svg-loader',
              query: {
                jsx: true
              }
            }
          ]
        }]
      },      
      plugins: [
        CSSExtract,
        new webpack.DefinePlugin(envKeys)
      ],
      devtool: isProduction ? 'source-map' : 'inline-source-map',
      devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback:true,
        publicPath: '/dist/'
      }
    };
};
