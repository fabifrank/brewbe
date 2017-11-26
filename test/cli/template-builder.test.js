import test from 'ava';

var fs = require('fs')
var child = require('child_process')
var builder = require('../../src/template-builder')
var utils = require('../_utils')

test.beforeEach(() => utils.buildTestDirectories())
test.after(() => utils.clean())

test.cb('#cli brewbe buildout works correctly', t => {
  try {
    fs.statSync(utils.TEST_FILE_1_PATH_BUILT_DEV)
    t.fail(); // fail test if file exists
  } catch(e) {}

  child.exec('cd test_dir && brewbe buildout', (err, stdout, stderr) => {
    console.log(err, stdout, stderr)
    try {
      fs.statSync(utils.TEST_FILE_1_PATH_BUILT_DEV);
      t.pass();
    } catch(e) {
      t.fail()
    }
    t.end()
  });
});
