import test from 'ava';

var fs = require('fs')
var builder = require('../../src/template-builder')
var helper = require('./_helper')

test.beforeEach(() => helper.createTestFiles())

test.afterEach(() => helper.clean())

test.cb('#buildOut builds files correctly', t => {
  var fn = builder.buildOut(helper.CONFIG_CONTENT_JSON, helper.TEST_FILE_1_CONTENT, helper.TEST_FILE_1_PATH, 'production');
  fn(() => {
    var content = fs.readFileSync(helper.TEST_FILE_1_PATH_BUILT_PRODUCTION, 'utf8')
    t.is(content, `
  Hello production.
  What do you want to do with hello.
`)
    t.end()
  });
});

test.cb('#wrapFile does correctly buildout different envs', t => {
  var fn = builder.wrapFile(helper.TEST_FILE_1_PATH, helper.CONFIG_CONTENT_JSON);
  fn(() => {
    var contentDev = fs.readFileSync(helper.TEST_FILE_1_PATH_BUILT_DEV, 'utf8')
    t.is(contentDev, `
  Hello dev.
  What do you want to do with hello.
`);
    var contentStaging = fs.readFileSync(helper.TEST_FILE_1_PATH_BUILT_STAGING, 'utf8')
    t.is(contentStaging, `
  Hello staging.
  What do you want to do with hello.
`);
    t.end()
  });
});
