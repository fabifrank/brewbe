import test from 'ava';

var fs = require('fs')
var builder = require('../../src/template-builder')

//test.after(helper.clean)

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

