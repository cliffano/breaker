var _ = require('underscore'),
  async = require('async'),
  cly = require('cly'),
  fs = require('fs'),
  p = require('path'),
  Table = require('easy-table');

function Shoot(opts) {

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
    var tagsOpts = _tags(_hosts),
      tasksOpts = _tasks(),
      hosts = [],
      ignoredTags = [],
      actions = {};

    if (tasksOpts.indexOf(task) === -1) {
      cb(new Error('Task ' + task + ' is not available'));
    } else {

      tags.forEach(function (tag) {
        if (tags.indexOf(tag) === -1) {
          ignoredTags.push(tag);
        } else {
          hosts = hosts.concat(tagsOpts[tag]);
        }
      });

      hosts = _.uniq(hosts);

      if (_.isEmpty(hosts)) {
        cb(new Error('All tags are not available'));
      } else {
        hosts.forEach(function (host) {
          actions[host] = function (cb) {
            cly.exec('echo \'************************\n[' + host + ']\'; ssh ' + host + ' \'bash -s\' < ' + task + '.sh', true, cb);
          };
        });
        async.parallel(actions, cb);        
      }
    }
  }

  return {
    tasks: tasks,
    hosts: hosts,
    tags: tags,
    exec: exec
  };
}

exports.Shoot = Shoot;