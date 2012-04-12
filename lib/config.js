var _ = require('underscore'),
  cly = require('cly'),
  fs = require('fs'),
  p = require('path');

function Config(dir) {

  function tasks() {
    var files = fs.readdirSync(dir),
      _tasks = [];
    files.forEach(function (file) {
      if (file.match(/\.sh$/)) {
        _tasks.push(file.replace(/\.sh$/, ''));
      }
    });
    return _tasks;
  }

  function hostsByTag() {
    return cly.readJsonFile(p.join(dir, 'hosts.json'));
  }

  function tagsByHost() {
    var conf = hostsByTag(),
      tags = {};
    _.keys(conf).forEach(function (host) {
      conf[host].forEach(function (tag) {
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

  return {
    tasks: tasks,
    hostsByTag: hostsByTag,
    tagsByHost: tagsByHost
  };
}

exports.Config = Config;