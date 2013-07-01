var _ = require('lodash'),
  bag = require('bagofcli'),
  Breaker = require('./breaker');

function _init() {
  console.log('Creating sample Breaker hosts file: .breaker.json');
  new Breaker().init(bag.exit);
}

function _format(args) {
  args = args || {};

  var opts = {};
  if (args.labels) {
    opts.labels = args.labels.split(',');
  }

  new Breaker(opts).format(args.type || 'sshconfig', bag.exit);
}

function _ssh(command, args) {
  args = args || {};

  var opts = {};
  if (args.labels) {
    opts.labels = args.labels.split(',');
  }

  new Breaker(opts).ssh(command, bag.exit);
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

  bag.command(__dirname, actions);
}

exports.exec = exec;