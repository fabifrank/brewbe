"use strict";
const globby = require('globby')
const nosync = require('async')
const handlebars = require('handlebars')
const fs = require('fs');
const sys = require('./system')
const gitignorePath = sys.getRootDirectory() + '/.gitignore';

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
  let newFile = filename.replace(/\.(.*)#buildout/, '$1')
  if (env) {
    newFile += '#' + env
  }
  return newFile
}
exports.getNewFileName = getNewFileName;


/**
 * cleanOut will remove the file
 *
 * @param filename
 * @param env
 * @returns {undefined}
 */
function cleanOut(filename, env) {
  return function(callback) {
    let file = getNewFileName(filename, env);
    console.log('Clean: ', file)
    try {
      fs.statSync(file);
      fs.unlinkSync(file);
    } catch(e) {}
    return callback();
  }
}
exports.cleanOut = cleanOut;

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
  let _config = JSON.parse(JSON.stringify(config))
  return function(callback) {
    _config.env = env
    let tpl = handlebars.compile(content)
    let filled = tpl(_config)
    //console.log("Compiled Template", filled)
    let newFile = getNewFileName(filename, env)
    sys.ensureFolderExists(newFile).then(() => {
      console.log('Create: ', newFile)
      fs.writeFile(newFile, filled, 'utf-8', function(err) {
        if (err) throw new Error('Cannot write file: ' + newFile)
        addGitignoreEntry(newFile).then(callback);
      });
    });
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
function wrapFile(filename, config, cleanOnly, fileCallback) {
  return function(callback) {
    let buildFns = []
    fs.readFile(filename, 'utf-8', function(err, content) {
      if (containsEnv(content)) {
        buildFns = config.environments.map(function(env) {
          if (fileCallback) fileCallback(filename, env)
          if (cleanOnly) return cleanOut(filename, env);
          return buildOut(config, content, filename, env);
        })
      } else {
        if (fileCallback) fileCallback(filename)
        if (cleanOnly) buildFns.push(cleanOut(filename, env));
        else buildFns.push(buildOut(config, content, filename, null))
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
function runConfig(config, cleanOnly) {
  return new Promise((resolve, reject) => {
    globby([process.cwd()  + '/**/.*#buildout', process.cwd() + '/**/.*#buildout/**/*'], { nodir: true }).then((files) => {
      let fnWraps = files.map(function(file) {
        return wrapFile(file, config, cleanOnly)
      })
      nosync.parallelLimit(fnWraps, 5, resolve)
    });
  });
}
exports.runConfig = runConfig;

/**
 * updateGitignore
 *
 * @param filename
 * @param gitignorePath Only to overwrite default, which is process.cwd() + '/.gitignore'. Otherwise integration tests wont work.
 * @returns {undefined}
 */
function addGitignoreEntry(filename) {
  return new Promise((resolve, reject) => {
    let content = fs.readFileSync(gitignorePath, 'utf8');
    if (content.indexOf(filename) === -1) {
      content += '\n' + filename;
      fs.writeFileSync(gitignorePath, content, 'utf8');
    }
    resolve();
  });
}
exports.addGitignoreEntry = addGitignoreEntry;
