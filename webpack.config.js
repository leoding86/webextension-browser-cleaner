'use strict'

const fs = require('fs-extra');
const backgroundConfig = require('./config/webpack.background.config');
const optionsPageConfig = require('./config/webpack.options-page.config');

// clean dist
fs.emptyDirSync('./dist')

module.exports = [
  backgroundConfig,
  optionsPageConfig
]
