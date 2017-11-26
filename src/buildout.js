var fs = require('fs')
var ini = require('ini')
var config = ini.parse(fs.readFileSync('./buildout.cfg', 'utf-8'))

/**
 * Template Builder
 */
var templateBuilder = require('./template-builder.js')
templateBuilder.runConfig(config)
