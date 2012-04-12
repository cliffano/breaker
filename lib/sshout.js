var _ = require('underscore'),
  cly = require('cly'),
  fs = require('fs'),
  p = require('path'),
  Table = require('easy-table');

function Sshout(opts) {
  
  var _hosts = cly.readJsonFile(p.join(opts.dir, 'hosts.json'));

  function _tasks(cb) {
    var tasks = [],
      files = fs.readdirSync(opts.dir);
    files.forEach(function (file) {
      if (file.match(/\.sh$/)) {
        tasks.push(file.replace(/\.sh$/, ''));
      }
    });
    return tasks;
  }

  function _tags(hosts) {
    var tags = {};
    _.keys(hosts).forEach(function (host) {
      hosts[host].forEach(function (tag) {
        if (!tags[tag]) {
          tags[tag] = [];
        }
        if (tags[tag].indexOf(host) === -1) {
          tags[tag].push(host);
        }
      });
    });
    return tags;
  }

  function tasks(cb) {
    _tasks().forEach(function (task) {
      console.log('* ' + task);
    });
    cb();
  }

  function hosts(cb) {
    var table = new Table();
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
      __tags = _tags(_hosts);
    _.keys(__tags).forEach(function (tag) {
      table.cell('Tag', tag);
      table.cell('Hosts', __tags[tag].join(','));
      table.newLine();
    });
    console.log(table.toString());
    cb();
  }

  return {
    tasks: tasks,
    hosts: hosts,
    tags: tags
  };
}

exports.Sshout = Sshout;