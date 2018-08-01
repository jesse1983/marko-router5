
const { cloneDeep } = require('lodash');
const path = require('path')

const webpackBuild = require('./webpack.config');
delete webpackBuild.devtool;
webpackBuild.entry = path.join(__dirname, 'src', 'index');
webpackBuild.output.filename = 'index.js';

module.exports = webpackBuild;
