/**
 * Simple Test Runner
 */

var BASE_DIR = 'tests/';

module.exports = function(tests){

  tests.forEach(function(test){
    var testDir = test.replace(/:/g, '/');
    require(BASE_DIR+testDir);
  });

};