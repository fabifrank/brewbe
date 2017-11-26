#!/usr/bin/env node

var fs = require('fs')
var ini = require('ini')
var config = ini.parse(fs.readFileSync('./buildout.cfg', 'utf-8'));
var program = require('commander');


program
.arguments('buildout')
.action(function(file) {
  var templateBuilder = require('./template-builder.js')
  templateBuilder.runConfig(config)
})
.parse(process.argv);
