// Patch to add missing globals
require('node/index')(this);

// Directory realitive to test directory
// use `:` for directory seperator
// be descriptive with your test file names
var tests = [
  'net:client'
];

var testRunner = require('tests/index');

testRunner(tests);