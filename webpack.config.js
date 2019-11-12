const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'examples', 'bundle'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /.marko$/,
      use: [{
        loader: '@marko/webpack/loader',
      }],
    },{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'stage-1'],
      }
    }, {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    }],
  },
  resolve: {
    extensions: ['.json', '.js', '.marko']
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 8081,
    contentBase: path.join(__dirname, 'examples'),
    publicPath: path.join('/dist'),
    disableHostCheck: true,
    before: (app) => {
      app.get('*', (req, res, next) => {
        if (req.path === '/dist/index.js') {
          next();
        } else {
          res.sendFile(path.join(__dirname + '/examples/index.html'));
        }
      });
    }
  }
};
