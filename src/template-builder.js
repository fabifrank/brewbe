var glob = require('glob')
var nosync = require('async')
var handlebars = require('handlebars')
var fs = require('fs')

function containsEnv(content) {
  if (content.indexOf('{{env}}') == -1) {
    return false
  }
  return true
}
exports.containsEnv = containsEnv;

/**
 * getNewFileName to return target filename
 *
 * @param filename
 * @param env
 * @returns {undefined}
 */
function getNewFileName(filename, env) {
  var newFile = filename.replace(/\.(.*)#buildout/, '$1')
  if (env) {
    newFile += '#' + env
  }
  return newFile
}
exports.getNewFileName = getNewFileName;

/**
 * buildOut to fill file at location with content
 *
 * @param config
 * @param content
 * @param filename
 * @param env
 * @returns {undefined}
 */
function buildOut(config, content, filename, env) {
  var _config = JSON.parse(JSON.stringify(config))
  return function(callback) {
    _config.env = env
    var tpl = handlebars.compile(content)
    var filled = tpl(_config)
    //console.log("Compiled Template", filled)
    var newFile = getNewFileName(filename, env)
    console.log('Create: ', newFile)
    fs.writeFile(newFile, filled, 'utf-8', function(err) {
      if (err) throw new Error('Cannot write file: ' + newFile)
      callback()
    })
  }
}
exports.buildOut = buildOut;

/**
 * wrapFile to parse files in respect to {{env}} tags and fill content
 *
 * @param filename
 * @param config
 * @returns {undefined}
 */
function wrapFile(filename, config, fileCallback) {
  return function(callback) {
    var buildFns = []
    fs.readFile(filename, 'utf-8', function(err, content) {
      if (containsEnv(content)) {
        buildFns = config.environments.map(function(env) {
          if (fileCallback) fileCallback(filename, env)
          return buildOut(config, content, filename, env)
        })
      } else {
        if (fileCallback) fileCallback(filename)
        buildFns.push(buildOut(config, content, filename, null))
      }
      nosync.parallel(buildFns, callback)
    })
  }
}
exports.wrapFile = wrapFile;

/**
 * runConfig to search for files matching certain pattern which should be built out
 *
 * @param config
 * @returns {undefined}
 */
function runConfig(config) {
  return new Promise((resolve, reject) => {
    glob('**/.*#buildout', function(err, files) {
      var fnWraps = files.map(function(file) {
        return wrapFile(file, config)
      })
      nosync.parallelLimit(fnWraps, 5, resolve)
    });
  });
}
exports.runConfig = runConfig;
