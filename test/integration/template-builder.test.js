import test from 'ava';

var fs = require('fs')
var builder = require('../../src/template-builder')
var helper = require('./_helper')

test.beforeEach(() => helper.buildTestDirectories())
test.after(() => helper.clean())

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

test.cb('#wrapFile does correctly call the fileCallback on each file', t => {
  var files = [];
  var fn = builder.wrapFile(helper.TEST_FILE_1_PATH, helper.CONFIG_CONTENT_JSON, false, (filename, env) => {
    files.push([filename, env]);
  })(() => {
    t.deepEqual(files, [
      ['test_dir/.testfile1#buildout', 'dev'],
      ['test_dir/.testfile1#buildout', 'staging']
    ]);
    t.end();
  });
});

test.cb('#runConfig does correctly buildout files different envs', t => {
  var fn = builder.runConfig(helper.CONFIG_CONTENT_JSON).then(() => {
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

test.cb('#cleanOut removes the file', t => {
  fs.writeFileSync(helper.TEST_FILE_1_PATH_BUILT_STAGING, 'testhello', 'utf8');
  builder.cleanOut(helper.TEST_FILE_1_PATH, 'staging')(() => {
    try {
      fs.statSync(helper.TEST_FILE_1_PATH_BUILT_STAGING);
      t.fail();
    } catch(e) {
      t.pass();
    }
    t.end();
  });
});

test.cb('#runConfig with cleanOnly deletes all existing built files', t => {
  fs.writeFileSync(helper.TEST_FILE_1_PATH_BUILT_STAGING, 'testhello', 'utf8');
  var fn = builder.runConfig(helper.CONFIG_CONTENT_JSON, true).then(() => {
    try {
      fs.statSync(helper.TEST_FILE_1_PATH_BUILT_STAGING);
      t.fail();
    } catch(e) {
      t.pass();
    }
    t.end();
  });
});
