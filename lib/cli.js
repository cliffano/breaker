var _ = require('underscore'),
  bag = require('bagofholding'),
  Breaker = require('./breaker'),
  breaker = new Breaker();

function _init() {
  breaker.init(bag.cli.exit);
}

function _format(args) {
  breaker.format(args.type || 'sshconfig', bag.cli.exit);
}

function _ssh(command, args) {
  var labels = (args.labels) ? args.labels.split(',') : [];
  breaker.ssh(command, labels, bag.cli.exit);
}

/**
 * Execute Breaker.
 */
function exec() {

  var actions = {
    commands: {
      init: { action: _init },
      format: { action: _format },
      ssh: { action: _ssh }
    }
  };

  bag.cli.command(__dirname, actions);
}

exports.exec = exec;