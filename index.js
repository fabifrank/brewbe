#!/usr/bin/env node

var fs = require('fs')
var ini = require('ini')
var config = ini.parse(fs.readFileSync('./buildout.cfg', 'utf-8'));
var program = require('commander');
var templateBuilder = require('./src/template-builder.js')

/**
 * Template Builder
 */
program
.arguments('buildout')
.action((file) => {
  templateBuilder.runConfig(config)
})
.parse(process.argv);

/**
 * Clean
 */
program
.arguments('clean')
.action(() => {
  templateBuilder.runConfig(config, true)
})
.parse(process.argv);
