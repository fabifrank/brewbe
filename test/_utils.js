const fs = require('fs');
const rimraf = require('rimraf');
const ini = require('ini');
const proxyquire = require('proxyquire');

/**
 * Proxy the root directory
 */
exports.getTemplateBuilderStub = () => {
  return proxyquire('../src/template-builder', {
    './system': {
      'getRootDirectory': () => {
        return process.cwd() + '/test_dir';
      }
    }
  });
}



const DIR_NAME = 'test_dir';
exports.DIR_NAME = DIR_NAME;

const TEST_FILE_1_PATH = DIR_NAME + '/.testfile1#buildout';
exports.TEST_FILE_1_PATH = TEST_FILE_1_PATH;
const TEST_FILE_1_PATH_BUILT = DIR_NAME + '/testfile1';
exports.TEST_FILE_1_PATH_BUILT = TEST_FILE_1_PATH_BUILT;
const TEST_FILE_1_PATH_BUILT_DEV = DIR_NAME + '/testfile1#dev';
exports.TEST_FILE_1_PATH_BUILT_DEV = TEST_FILE_1_PATH_BUILT_DEV;
const TEST_FILE_1_PATH_BUILT_STAGING = DIR_NAME + '/testfile1#staging';
exports.TEST_FILE_1_PATH_BUILT_STAGING = TEST_FILE_1_PATH_BUILT_STAGING;
const TEST_FILE_1_PATH_BUILT_PRODUCTION = DIR_NAME + '/testfile1#production';
exports.TEST_FILE_1_PATH_BUILT_PRODUCTION = TEST_FILE_1_PATH_BUILT_PRODUCTION;

const TEST_FOLDER_PATH = DIR_NAME + '/.folder#buildout';
exports.TEST_FOLDER_PATH = TEST_FOLDER_PATH;

const TEST_FOLDER_BUILDOUT_PATH = DIR_NAME + '/folder';
exports.TEST_FOLDER_BUILDOUT_PATH = TEST_FOLDER_BUILDOUT_PATH;

const TEST_FOLDER_FILE_1_PATH = TEST_FOLDER_PATH + '/testfile2';
exports.TEST_FOLDER_FILE_1_PATH = TEST_FOLDER_FILE_1_PATH;

const TEST_FOLDER_FILE_1_PATH_BUILT_DEV = TEST_FOLDER_BUILDOUT_PATH + '/testfile2#dev';
exports.TEST_FOLDER_FILE_1_PATH_BUILT_DEV = TEST_FOLDER_FILE_1_PATH_BUILT_DEV;

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
exports.CONFIG_CONTENT_JSON = ini.parse(CONFIG_CONTENT_INI, 'utf8');

const GITIGNORE_PATH = DIR_NAME + '/.gitignore';
exports.GITIGNORE_PATH = GITIGNORE_PATH;

const GITIGNORE_CONTENT = `
test_dir/test_hello
hello/world
`;
exports.GITIGNORE_CONTENT = GITIGNORE_CONTENT;

function createTestDir() {
  fs.mkdirSync(DIR_NAME);
}

function createBuildoutTestfolder() {
  fs.mkdirSync(TEST_FOLDER_PATH);
  fs.mkdirSync(TEST_FOLDER_BUILDOUT_PATH);
}

function createBuildoutTestFolderFile() {
  fs.writeFileSync(TEST_FOLDER_FILE_1_PATH, TEST_FILE_1_CONTENT, 'utf8')
}

function createGitignore() {
  fs.writeFileSync(GITIGNORE_PATH, GITIGNORE_CONTENT, 'utf8')
}

function clean() {
  rimraf.sync(DIR_NAME);
}
exports.clean = clean;

function createTestFiles() {
  fs.writeFileSync(TEST_FILE_1_PATH, TEST_FILE_1_CONTENT, 'utf8');
}

function createConfig() {
  fs.writeFileSync(CONFIG_PATH, CONFIG_CONTENT_INI, 'utf8');
}

exports.buildTestDirectories = function() {
  clean();
  createTestDir();
  createBuildoutTestfolder();
  createBuildoutTestFolderFile();
  createGitignore();
  createConfig();
  createTestFiles();
}
