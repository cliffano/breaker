var _ = require('lodash'),
  async = require('async'),
  bag = require('bagofcli'),
  colors = require('colors'),
  fs = require('fs'),
  fsx = require('fs.extra'),
  p = require('path'),
  ssh2 = require('ssh2'),
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
    item.ssh.forEach(function (sshItem) {
      tasks.push(function (cb) {
        var privateKey = fs.readFileSync(sshItem.key);
        var conn = new ssh2.Client();
        conn.on('ready', function() {
          conn.exec(command, function(err, stream) {
            if (err) {
              cb(err);
            } else {
              stream.on('close', function(code, signal) {
                conn.end();
                console.log('Exit code: ' + code);
                if (code != '0') {
                  cb(new Error('An error occurred when executing command: ' + command + ', exit code: ' + code));
                } else {
                  cb();
                }
              }).on('data', function(data) {
                console.log(data.toString('utf8').green);
              }).stderr.on('data', function(data) {
                console.error(data.toString('utf8').red);
              });
            }
          });
        }).connect({
          host: item.host,
          port: sshItem.port,
          username: sshItem.user,
          privateKey: privateKey
        });
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
