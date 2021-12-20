/* eslint-disable global-require */
const path = require('path');

let pkg = {};

try {
  // eslint-disable-next-line import/no-dynamic-require
  pkg = require(path.resolve(process.cwd(), 'package.json'));
} catch (err) {
  console.log(err);
}

const config = Object.assign({
  browsers: ['ie > 9', 'last 2 versions'],
  out: './theme',
  config: './stroll-variables.scss',
  minimize: false
}, pkg['stroll-theme'])

exports.themePath = path.resolve(process.cwd(), './node_modules/' + config.theme)
exports.out = config.out;
exports.config = config.config;
exports.minimize = config.minimize;
exports.browsers = config.browsers;
exports.components = config.components;
exports.themeName = config.theme;
