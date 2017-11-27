#!/usr/bin/env node

var fs = require('fs')
var ini = require('ini')
var config = ini.parse(fs.readFileSync('./buildout.cfg', 'utf-8'));
var program = require('commander');
var templateBuilder = require('./src/template-builder.js')

program
.arguments('<action>')
.action((action) => {
  if (action === 'buildout') templateBuilder.runConfig(config, false, program.updateGitignore);
  if (action === 'clean') templateBuilder.runConfig(config, true, program.updateGitignore);
})
.parse(process.argv);

