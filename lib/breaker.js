var _ = require('underscore'),
  async = require('async'),
  bag = require('bagofholding'),
  fsx = require('fs.extra'),
  p = require('path');

/**
 * class Breaker
 */
function Breaker() {
}

/**
 * Create a sample .breaker.json hosts file in current directory.
 *
 * @param {Function} cb: standard cb(err, result) callback
 */
Breaker.prototype.init = function (cb) {
  console.log('Creating sample Breaker hosts file: .breaker.json');
  fsx.copy(p.join(__dirname, '../examples/.breaker.json'), '.breaker.json', cb);
};

/**
 * Format hosts info into specific type.
 *
 * @param {String} type: Format type
 * @param {Function} cb: standard cb(err, result) callback
 */
Breaker.prototype.format = function (type, cb) {
  var formatter = require('./formatters/' + type),
    conf = JSON.parse(bag.cli.readConfigFileSync('.breaker.json'));

  console.log(formatter.format(conf));
  cb();
};

/**
 * Execute shell command via SSH
 *
 * @param {String} command: Shell command to execute
 * @param {Array} labels: an array of filter labels to decide which hosts to use
 * @param {Function} cb: standard cb(err, result) callback
 */
Breaker.prototype.ssh = function (command, labels, cb) {
  var conf = JSON.parse(bag.cli.readConfigFileSync('.breaker.json')),
    tasks = [];

  conf.forEach(function (item) {
    if (!labels || labels.length === 0 || _.intersection(labels, item.labels).length >= 1) {
      tasks.push(function (cb) {
        console.log('+ %s', item.host);
        var sshCommand = 'ssh ' +
          ((item.key) ? '-i ' + item.key : '') +
          ' ' +
          ((item.user) ? item.user + '@' : '') +
          item.host +
          ((item.port) ? ':' + item.port : '') +
          ' \'' + command + '\'';
        bag.cli.exec(sshCommand, true, cb);
      });
    }
  });

  async.series(tasks, cb);
};

module.exports = Breaker;