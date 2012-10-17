/**
 * domain
 *
 * @status passing
 */

var util = node.require('util');
var events = node.require('events');
var EventEmitter = events.EventEmitter;
var inherits = util.inherits;

// methods that are called when trying to shut down expliclitly bound EEs
var endMethods = ['end', 'abort', 'destroy', 'destroySoon'];

// communicate with events module, but don't require that
// module to have to load this one, since this module has
// a few side effects.
events.usingDomains = true;

exports.Domain = Domain;

exports.create = exports.createDomain = function(cb) {
  return new Domain(cb);
};

// it's possible to enter one domain while already inside
// another one.  the stack is each entered domain.
var stack = [];
exports._stack = stack;
// the active domain is always the one that we're currently in.
exports.active = null;


// loading this file the first time sets up the global
// uncaughtException handler.
process.on('uncaughtException', uncaughtHandler);

function uncaughtHandler(er) {
  // if there's an active domain, then handle this there.
  // Note that if this error emission throws, then it'll just crash.
  if (exports.active && !exports.active._disposed) {
    util._extend(er, {
      domain: exports.active,
      domain_thrown: true
    });
    exports.active.emit('error', er);
    if (exports.active) exports.active.exit();
  } else if (process.listeners('uncaughtException').length === 1) {
    // if there are other handlers, then they'll take care of it.
    // but if not, then we need to crash now.
    throw er;
  }
}

inherits(Domain, EventEmitter);

function Domain() {
  EventEmitter.apply(this);

  this.members = [];
}

Domain.prototype.enter = function() {
  if (this._disposed) return;

  // note that this might be a no-op, but we still need
  // to push it onto the stack so that we can pop it later.
  exports.active = process.domain = this;
  stack.push(this);
};

Domain.prototype.exit = function() {
  if (this._disposed) return;

  // exit all domains until this one.
  var d;
  do {
    d = stack.pop();
  } while (d && d !== this);

  exports.active = stack[stack.length - 1];
  process.domain = exports.active;
};

// note: this works for timers as well.
Domain.prototype.add = function(ee) {
  // disposed domains can't be used for new things.
  if (this._disposed) return;

  // already added to this domain.
  if (ee.domain === this) return;

  // has a domain already - remove it first.
  if (ee.domain) {
    ee.domain.remove(ee);
  }

  // check for circular Domain->Domain links.
  // This causes bad insanity!
  //
  // For example:
  // var d = domain.create();
  // var e = domain.create();
  // d.add(e);
  // e.add(d);
  // e.emit('error', er); // RangeError, stack overflow!
  if (this.domain && (ee instanceof Domain)) {
    for (var d = this.domain; d; d = d.domain) {
      if (ee === d) return;
    }
  }

  ee.domain = this;
  this.members.push(ee);
};

Domain.prototype.remove = function(ee) {
  ee.domain = null;
  var index = this.members.indexOf(ee);
  if (index !== -1) {
    this.members.splice(index, 1);
  }
};

Domain.prototype.run = function(fn) {
  return this.bind(fn)();
};

Domain.prototype.intercept = function(cb) {
  return this.bind(cb, true);
};

Domain.prototype.bind = function(cb, interceptError) {
  // if cb throws, catch it here.
  var self = this;
  var b = function() {
    // disposing turns functions into no-ops
    if (self._disposed) return;

    if (this instanceof Domain) {
      return cb.apply(this, arguments);
    }

    // only intercept first-arg errors if explicitly requested.
    if (interceptError && arguments[0] &&
        (arguments[0] instanceof Error)) {
      var er = arguments[0];
      util._extend(er, {
        domain_bound: cb,
        domain_thrown: false,
        domain: self
      });
      self.emit('error', er);
      return;
    }

    // remove first-arg if intercept as assumed to be the error-arg
    if (interceptError) {
      var len = arguments.length;
      var args;
      switch (len) {
        case 0:
        case 1:
          // no args that we care about.
          args = [];
          break;
        case 2:
          // optimization for most common case: cb(er, data)
          args = [arguments[1]];
          break;
        default:
          // slower for less common case: cb(er, foo, bar, baz, ...)
          args = new Array(len - 1);
          for (var i = 1; i < len; i++) {
            args[i - 1] = arguments[i];
          }
          break;
      }
      self.enter();
      var ret = cb.apply(this, args);
      self.exit();
      return ret;
    }

    self.enter();
    var ret = cb.apply(this, arguments);
    self.exit();
    return ret;
  };
  b.domain = this;
  return b;
};

Domain.prototype.dispose = function() {
  if (this._disposed) return;

  // if we're the active domain, then get out now.
  this.exit();

  this.emit('dispose');

  // remove error handlers.
  this.removeAllListeners();
  this.on('error', function() {});

  // try to kill all the members.
  // XXX There should be more consistent ways
  // to shut down things!
  this.members.forEach(function(m) {
    // if it's a timeout or interval, cancel it.
    clearTimeout(m);

    // drop all event listeners.
    if (m instanceof EventEmitter) {
      m.removeAllListeners();
      // swallow errors
      m.on('error', function() {});
    }

    // Be careful!
    // By definition, we're likely in error-ridden territory here,
    // so it's quite possible that calling some of these methods
    // might cause additional exceptions to be thrown.
    endMethods.forEach(function(method) {
      if (typeof m[method] === 'function') {
        try {
          m[method]();
        } catch (er) {}
      }
    });

  });

  // remove from parent domain, if there is one.
  if (this.domain) this.domain.remove(this);

  // kill the references so that they can be properly gc'ed.
  this.members.length = 0;

  // finally, mark this domain as 'no longer relevant'
  // so that it can't be entered or activated.
  this._disposed = true;
};