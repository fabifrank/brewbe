import test from 'ava';

var fs = require('fs')
var builder = require('../../src/template-builder')
var utils = require('../_utils')

test.beforeEach(() => utils.buildTestDirectories())
test.afterEach(() => utils.clean())

test.cb('#buildOut builds files correctly', t => {
  var fn = builder.buildOut(utils.CONFIG_CONTENT_JSON, utils.TEST_FILE_1_CONTENT, utils.TEST_FILE_1_PATH, 'production');
  fn(() => {
    var content = fs.readFileSync(utils.TEST_FILE_1_PATH_BUILT_PRODUCTION, 'utf8')
    t.is(content, `
  Hello production.
  What do you want to do with hello.
`)
    t.end()
  });
});

test.cb('#wrapFile does correctly buildout different envs', t => {
  var fn = builder.wrapFile(utils.TEST_FILE_1_PATH, utils.CONFIG_CONTENT_JSON);
  fn(() => {
    var contentDev = fs.readFileSync(utils.TEST_FILE_1_PATH_BUILT_DEV, 'utf8')
    t.is(contentDev, `
  Hello dev.
  What do you want to do with hello.
`);
    var contentStaging = fs.readFileSync(utils.TEST_FILE_1_PATH_BUILT_STAGING, 'utf8')
    t.is(contentStaging, `
  Hello staging.
  What do you want to do with hello.
`);
    t.end()
  });
});

test.cb('#wrapFile does correctly call the fileCallback on each file', t => {
  var files = [];
  var fn = builder.wrapFile(utils.TEST_FILE_1_PATH, utils.CONFIG_CONTENT_JSON, false, (filename, env) => {
    files.push([filename, env]);
  })(() => {
    t.deepEqual(files, [
      [process.cwd() + '/test_dir/.testfile1#buildout', 'dev'],
      [process.cwd() + '/test_dir/.testfile1#buildout', 'staging']
    ]);
    t.end();
  });
});

test.cb('#runConfig does correctly buildout files for different envs', t => {
  var fn = builder.runConfig(utils.CONFIG_CONTENT_JSON)
    .then(() => {
    var contentDev = fs.readFileSync(utils.TEST_FILE_1_PATH_BUILT_DEV, 'utf8')
    t.is(contentDev, `
  Hello dev.
  What do you want to do with hello.
`);
    var contentStaging = fs.readFileSync(utils.TEST_FILE_1_PATH_BUILT_STAGING, 'utf8')
    t.is(contentStaging, `
  Hello staging.
  What do you want to do with hello.
`);
    t.end()
  })
  .catch((err) => {
    console.log(err)
    t.fail()
  });
});

test.cb('#cleanOut removes the file', t => {
  fs.writeFileSync(utils.TEST_FILE_1_PATH_BUILT_STAGING, 'testhello', 'utf8');
  builder.cleanOut(utils.TEST_FILE_1_PATH, 'staging')(() => {
    try {
      fs.statSync(utils.TEST_FILE_1_PATH_BUILT_STAGING);
      t.fail();
    } catch(e) {
      t.pass();
    }
    t.end();
  });
});

test.cb('#runConfig with cleanOnly deletes all existing built files', t => {
  fs.writeFileSync(utils.TEST_FILE_1_PATH_BUILT_STAGING, 'testhello', 'utf8');
  var fn = builder.runConfig(utils.CONFIG_CONTENT_JSON, true).then(() => {
    try {
      fs.statSync(utils.TEST_FILE_1_PATH_BUILT_STAGING);
      t.fail();
    } catch(e) {
      t.pass();
    }
    t.end();
  });
});

test.cb('#addGitignoreEntry should add file entry correctly', t => {
  var gitignorePath = utils.DIR_NAME + '/.gitignore';
  t.is(fs.readFileSync(gitignorePath, 'utf8'), utils.GITIGNORE_CONTENT);
  var fn = builder.addGitignoreEntry(utils.TEST_FILE_1_PATH_BUILT_DEV, gitignorePath).then(() => {
    const newContent = utils.GITIGNORE_CONTENT + '\n' + utils.TEST_FILE_1_PATH_BUILT_DEV
    t.is(fs.readFileSync(gitignorePath, 'utf8'), newContent);

    var fn = builder.addGitignoreEntry(utils.TEST_FILE_1_PATH_BUILT_DEV, gitignorePath).then(() => {
      // check that entry is not added twice
      t.is(fs.readFileSync(utils.GITIGNORE_PATH, 'utf8'), newContent);
      t.end();
    });
  });
});
