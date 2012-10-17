
/**
 * expose node
 */
module.exports = function (global) {

  /**
   * Patches to JSCore JS to add missing functions
   */

  // Global node path for module path resolution
  global.$NODE_PATH = global.$NODE_PATH || 'node/';

  // Global node namespace to expose require function
  global.node = {};

  // Global process shim
  global.process = {};

  /**
   * [isNaN description]
   * @param  {[type]}  e [description]
   * @return {Boolean}   [description]
   */
  global.isNaN = function(e) {

  };

  /**
   * [isFinite description]
   * @return {Boolean} [description]
   */
  global.isFinite = function() {

  };

  /**
   * [toNumber description]
   * @return {[type]} [description]
   */
  global.toNumber = function() {

  };


  /**
   * Node process shim
   */
  var process = global.process;
  // Module cache for `node.require`
  process._loadedBindings = {};
  process._loadedModules = {};
  process.title = 'Titanium';
  process.platform = Ti.Platform.osname;
  process.env = {NODE_DEBUG:''};
  process.argv = [];

  /**
   * nextTick
   * calls function on emulate js eventloop next pass
   * @return {Function}
   */
  process.nextTick = (function () {
      return function nextTick(fn) {
          setTimeout(fn, 0);
      };
  })();

  /**
   * shimmy for native binding function
   * Used to require native ti modules wrapped to emulate
   * native node bindings
   *
   * @param  {String} name
   * @return {Object}
   */
  process.binding = function (name) {
    return (process._loadedBindings[name])
              ? process._loadedBindings[name]
              : process._loadedBindings[name] = require($NODE_PATH+'src/'+name);
  };

  (function () {
      var cwd = '/';
      var path;
      process.cwd = function () { return cwd; };
      process.chdir = function (dir) {
      };
  })();

  /**
   * Fake require to lazy load node modules
   * Uses Global $NODE_PATH to help resolve path
   *
   *  var assert = node.require('assert');
   *
   * @param  {String}
   * @return {Object}
   * @api public
   */
  node.require = function(name){
    return (process._loadedModules[name]) ? process._loadedModules[name] : process._loadedModules[name] = require($NODE_PATH+'lib/'+name);
  };

};
