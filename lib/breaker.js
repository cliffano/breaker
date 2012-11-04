var _ = require('underscore'),
  bag = require('bagofholding'),
  fs = require('fs'),
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

module.exports = Breaker;
/*
var _ = require('underscore'),
  async = require('async'),
  _exec = require('./exec'),
  Table = require('easy-table');

function Sshm(opts) {

  var config = new require('./config').Config(opts.dir);

  function tasks(cb) {
    var _tasks = config.tasks();
    if (!_.isEmpty(_tasks)) {
      _tasks.forEach(function (task) {
        console.log('* ' + task);
      });
    } else {
      console.warn('* There is no task available');
    }
    cb();
  }

  function hosts(cb) {
    var table = new Table(),
      _hosts = config.hostsByTag();
    _.keys(_hosts).forEach(function (host) {
      table.cell('Host', host);
      table.cell('Tags', _hosts[host].join(','));
      table.newLine();
    });
    console.log(table.toString());
    cb();
  }

  function tags(cb) {
    var table = new Table(),
      _tags = config.tagsByHost();
    _.keys(_tags).forEach(function (tag) {
      table.cell('Tag', tag);
      table.cell('Hosts', _tags[tag].join(','));
      table.newLine();
    });
    console.log(table.toString());
    cb();
  }

  function exec(task, tags, cb) {

    var availTasks = config.tasks(),
      tagsByHost = config.tagsByHost(),
      availTags = _.keys(tagsByHost),
      hosts = [],
      actions = [];
    
    tags.forEach(function (tag) {
      if (availTags.indexOf(tag) === -1) {
        console.warn('Ignoring unknown tag: ' + tag);
      } else {
        hosts = hosts.concat(tagsByHost[tag]);
      }
    });
    hosts = _.uniq(hosts);

    hosts.forEach(function (host) {
      actions.push(function (cb) {
        if (availTasks.indexOf(task) === -1) {
          _exec.command(task, opts.user, host, cb);
        } else {
          _exec.script(task, opts.user, host, cb);
        }
      });
    });

    async.parallel(actions, cb);
  }

  return {
    tasks: tasks,
    hosts: hosts,
    tags: tags,
    exec: exec
  };
}

exports.Sshm = Sshm;
*/