var _ = require('underscore'),
  bag = require('bagofholding'),
  Breaker = require('./breaker');

function _init() {
  console.log('Creating sample Breaker hosts file: .breaker.json');
  new Breaker().init(bag.cli.exit);
}

function _format(args) {
  args = args || {};

  var opts = {};
  if (args.labels) {
    opts.labels = args.labels.split(',');
  }

  new Breaker(opts).format(args.type || 'sshconfig', bag.cli.exit);
}

function _ssh(command, args) {
  args = args || {};

  var opts = {};
  if (args.labels) {
    opts.labels = args.labels.split(',');
  }

  new Breaker(opts).ssh(command, bag.cli.exit);
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