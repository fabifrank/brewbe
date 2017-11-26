var fs = require('fs');
var rimraf = require('rimraf');
var ini = require('ini');


const DIR_NAME = 'test_dir';

const TEST_FILE_1_PATH = DIR_NAME + '/.testfile1#buildout';
exports.TEST_FILE_1_PATH = TEST_FILE_1_PATH;

const TEST_FILE_1_PATH_BUILT = DIR_NAME + '/testfile1';
exports.TEST_FILE_1_PATH_BUILT = TEST_FILE_1_PATH_BUILT;

const TEST_FILE_1_PATH_BUILT_PRODUCTION = DIR_NAME + '/testfile1#production';
exports.TEST_FILE_1_PATH_BUILT_PRODUCTION = TEST_FILE_1_PATH_BUILT_PRODUCTION;

const TEST_FILE_1_CONTENT = `
  Hello {{env}}.
  What do you want to do with {{collection1.attribute1}}.
`;
exports.TEST_FILE_1_CONTENT = TEST_FILE_1_CONTENT;

const CONFIG_PATH = DIR_NAME + '/buildout.cfg'
const CONFIG_CONTENT_INI = `
    environments[] = dev
    environments[] = staging

    [collection1]
    attribute1 = hello
`;
exports.CONFIG_CONTENT_INI = CONFIG_CONTENT_INI;
exports.CONFIG_CONTENT_JSON = ini.parse(CONFIG_CONTENT_INI, 'utf8')

function createTestDir() {
  fs.mkdirSync(DIR_NAME);
}

function clean() {
  rimraf.sync(DIR_NAME);
}
exports.clean = clean;

function createTestFile1() {
  fs.writeFile(TEST_FILE_1_PATH, TEST_FILE_1_CONTENT, 'utf8')
}

function createConfig() {
  fs.writeFile(CONFIG_PATH, CONFIG_CONTENT_INI, 'utf8')
}

exports.createTestFiles = function() {
  clean();
  createTestDir();
  createConfig();
  createTestFile1();
}
