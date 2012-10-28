var _ = require('underscore'),
  bag = require('bagofholding'),
  breaker = require('./breaker');

/**
 * Execute breaker.
 */
function exec() {

  function _init() {
    new breaker().init(bag.cli.exit);
  }

  function _gen() {
    return function (args) {
      new breaker().gen(args.format || 'sshconfig', bag.cli.exit);
    };
  }

  function _ssh() {
    console.log('ssh');
    //new breaker().ssh(bag.cli.exit);
  }

  var commands = {
    init: {
      desc: 'Create sample Breaker hosts file',
      action: _init
    },
    gen: {
      desc: 'Generate hosts info in a specified format',
      options: [
        { arg: '-f, --format <format>' },
      ],
      action: _gen()
    },
    ssh: {
      desc: 'Remotely execute shell command on all configured hosts in parallel via SSH',
      options: [
        { arg: '-l, --labels <labels>', desc: 'Comma separated labels' },
      ],
      action: _ssh
    }
  };

  bag.cli.parse(commands, __dirname);
}

exports.exec = exec;