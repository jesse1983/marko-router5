
const { cloneDeep } = require('lodash');

const webpackProd = require('./webpack.config');
webpackProd.mode = 'production';
delete webpackProd.devtool;

const webpackMin = cloneDeep(webpackProd);
webpackMin.output.filename = 'index.min.js';

module.exports = [webpackProd, webpackMin];
