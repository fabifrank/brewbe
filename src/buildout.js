var fs = require('fs')
var ini = require('ini')
var config = ini.parse(fs.readFileSync('./buildout.cfg', 'utf-8'))
console.log('buildout.cfg', config)

/**
 * Template Builder
 */
var templateBuilder = require('./template-builder.js')
templateBuilder(config)
