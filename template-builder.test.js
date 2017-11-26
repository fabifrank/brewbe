import test from 'ava';

var fs = require('fs')
var builder = require('./src/template-builder')
var helper = require('./_helper')

test.afterEach(helper.clean)

test('#containsEnv indicates content requesting env', t => {
    let contentWith = `
      Hello world...
      We just want to test if {{env}} is correctly identified.
    `;
    let contentWithout = `
      Hello world...
      We just want to test if missing is correctly identified.
    `;
    t.is(builder.containsEnv(contentWith), true);
    t.is(builder.containsEnv(contentWithout), false);
});

test('#getNewFileName returns correct filename', t => {
  t.is(builder.getNewFileName('.bin#buildout', 'production'), 'bin#production')
  t.is(builder.getNewFileName('hello/world/.test#buildout', 'staging'), 'hello/world/test#staging')
  t.is(builder.getNewFileName('.bin#buildout'), 'bin')
  t.is(builder.getNewFileName('hello/world/.test#buildout'), 'hello/world/test')
});

test.cb('#buildOut builds files correctly', t => {
  helper.createTestFiles();

  var fn = builder.buildOut(helper.CONFIG_CONTENT_JSON, helper.TEST_FILE_1_CONTENT, helper.TEST_FILE_1_PATH, 'production');
  fn(() => {
    console.log("TEST")
    var content = fs.readFileSync(helper.TEST_FILE_1_PATH_BUILT_PRODUCTION, 'utf8')
    t.is(content, 'test')
    t.end()
  });
});

test('bar', async t => {
    const bar = Promise.resolve('bar');

      t.is(await bar, 'bar');
});
