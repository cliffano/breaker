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

  function _format() {
    return function (args) {
      new breaker().format(args.type || 'sshconfig', bag.cli.exit);
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
    format: {
      desc: 'Format hosts info into specific type',
      options: [
        { arg: '-t, --type <type>', desc: 'Format type' },
      ],
      action: _format()
    },
    ssh: {
      desc: 'Remotely execute shell command on selected configured hosts in parallel via SSH',
      options: [
        { arg: '-l, --labels <labels>', desc: 'Comma separated labels' },
      ],
      action: _ssh
    }
  };

  bag.cli.parse(commands, __dirname);
}

exports.exec = exec;