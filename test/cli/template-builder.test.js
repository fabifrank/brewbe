import test from 'ava';

var fs = require('fs')
var child = require('child_process')
var builder = require('../../src/template-builder')
var utils = require('../_utils')

test.beforeEach(() => utils.buildTestDirectories())
//test.after(() => utils.clean())

test.cb('#cli brewbe buildout works correctly', t => {
  try {
    fs.statSync(utils.TEST_FILE_1_PATH_BUILT_DEV)
    t.fail(); // fail test if file exists
  } catch(e) {}

  child.exec('cd test_dir && brewbe buildout && pwd && ls -R ', (err, stdout, stderr) => {
    try {
      fs.statSync(utils.TEST_FILE_1_PATH_BUILT_DEV);
      t.pass();
    } catch(e) {
      console.log(e)
      t.fail()
    }
    t.end()
  });
});

/*test.cb('#cli brewbe clean works correctly', t => {
  fs.writeFileSync(utils.TEST_FILE_1_PATH_BUILT_STAGING, 'testhello', 'utf8');

  child.exec('cd test_dir && brewbe clean && cd ..', (err, stdout, stderr) => {
    try {
      fs.statSync(utils.TEST_FILE_1_PATH_BUILT_STAGING);
      t.fail();
    } catch(e) {
      t.pass();
    }
    t.end();
  });
});

*/
