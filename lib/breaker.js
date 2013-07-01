var _ = require('lodash'),
  async = require('async'),
  bag = require('bagofcli'),
  fsx = require('fs.extra'),
  p = require('path'),
  util = require('util');

/**
 * class Breaker
 *
 * @param {Array} labels: an array of filter labels, used to determine which hosts to include
 */
function Breaker(opts) {
  this.opts = opts || {};
}

/**
 * Create a sample .breaker.json hosts file in current directory.
 *
 * @param {Function} cb: standard cb(err, result) callback
 */
Breaker.prototype.init = function (cb) {
  fsx.copy(p.join(__dirname, '../examples/.breaker.json'), '.breaker.json', cb);
};

/**
 * Format hosts info into specific type.
 *
 * @param {String} type: Format type
 * @param {Function} cb: standard cb(err, result) callback
 */
Breaker.prototype.format = function (type, cb) {
  var formatter = require('./formatters/' + type);
  console.log(formatter.format(this._config()));
  cb();
};

/**
 * Execute shell command via SSH
 *
 * @param {String} command: Shell command to execute
 * @param {Function} cb: standard cb(err, result) callback
 */
Breaker.prototype.ssh = function (command, cb) {
  var tasks = [];
  this._config().forEach(function (item) {
    
    console.log('+ %s', item.host);
    if (!item.ssh) {
      item.ssh = [{}];
    }
    item.ssh.forEach(function (sshItem) {
      tasks.push(function (cb) {
        var sshCommand = util.format('ssh %s %s%s%s %s',
          (sshItem.key) ? '-i ' + sshItem.key : '',
          (sshItem.user) ? sshItem.user + '@' : '',
          item.host,
          ((sshItem.port) ? ':' + sshItem.port : ''),
          '\'' + command + '\''
          );
        console.log('> ' + sshCommand);
        bag.exec(sshCommand, true, cb);
      });
    });
  });

  async.series(tasks, cb);
};

Breaker.prototype._config = function () {
  var conf = JSON.parse(bag.lookupFile('.breaker.json')),
    filtered = [],
    self = this;

  function _match(filters, labels) {
    var match = [];
    labels.forEach(function (label) {
      filters.forEach(function (filter) {
        if (label.match(new RegExp(filter))) {
          match.push(label);
        }
      });
    });
    return match;
  }

  if (this.opts.labels) {
    conf.forEach(function (item) {
      var match = _match(self.opts.labels, item.labels);
      if (match.length >= 1) {
        item.labels = match;
        filtered.push(item);
      }
    });
  } else {
    filtered = conf;
  }

  return filtered;
};

module.exports = Breaker;
