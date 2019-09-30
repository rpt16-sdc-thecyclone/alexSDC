const path = require('path');

module.exports = {

  entry: {
    app: './client/index.jsx'//,
    //test: './client/spec/tests.js',
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
};
