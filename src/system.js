const path = require('path');
const mkdirp = require('mkdirp');

/**
 * getRootDirectory is intended to be proxied when used in tests
 * @returns {undefined}
 */
exports.getRootDirectory = () => {
  return process.cwd()
}

/**
 * ensureFolderExists
 *
 * @returns {undefined}
 */
exports.ensureFolderExists = (filename) => {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(filename), function(err) {
      if (err) return reject();
      return resolve();
    });
  });
}
