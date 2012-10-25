var _ = require('underscore'),
  bag = require('bagofholding'),
  breaker = require('./breaker');

/**
 * Execute breaker.
 */
function exec() {

  function _config() {
    new breaker().config(bag.cli.exit);
  }

  function _export() {
    new breaker().export(bag.cli.exit);
  }

  function _ssh() {
    new breaker().ssh(bag.cli.exit);
  }

  var commands = {
    config: {
      desc: 'Create sample Breaker configuration file',
      action: _config
    },
    export: {
      desc: 'Export Breaker configuration file into other tools\' configuration file',
      options: [
        { arg: '-t, --tool <tool>', desc: 'The name of the tool/software which configuration file will be exported to' },
      ],
      action: _export
    },
    ssh: {
      desc: 'Remotely execute shell command on all configured hosts in parallel via SSH',
      action: _ssh
    }
  };

  bag.cli.parse(commands, __dirname);
}

exports.exec = exec;

/*
var cly = require('cly'),
  p = require('path'),
  sshm = new require('./sshm').Sshm({ dir: process.cwd() }),
  sshmDir = __dirname;

function exec() {
  
  var commands = {
    'init': {
      callback: function (args) {
        console.log('Creating Sshm hosts and task files');
        cly.copyDir(p.join(sshmDir, '../examples'), '.', cly.exit);
      }
    },
    'do': {
      callback: function (args) {
        if (args._.length === 3) {
          sshm.exec(args[1], args[2].split(','), cly.exit);
        } else {
          console.warn('Usage: sshm do <task|command> <tag>');
        }
      }
    }
  };

  ['tasks', 'hosts', 'tags'].forEach(function (command) {
    commands[command] = {
      callback: function (args) {
        sshm[command](cly.exit);
      }
    };
  });

  cly.parse(__dirname, 'sshm', commands);
}

exports.exec = exec;
*/