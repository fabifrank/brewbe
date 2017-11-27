/**
 * getRootDirectory is intended to be proxied when used in tests
 * @returns {undefined}
 */
exports.getRootDirectory = function() {
  return process.cwd()
}
