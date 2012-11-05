var bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  cli;

describe('cli', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/cli', {
      requires: {
        bagofholding: {
          cli: {
            exit: bag.cli.exit,
            parse: function (commands, dir) {
              checks.bag_parse_commands = commands;
              checks.bag_parse_dir = dir;
            }
          }
        },
        './breaker': function () {
          return {
            init: function (exit) {
              checks.breaker_init_exit = exit;
            },
            format: function (type, exit) {
              checks.breaker_format_type = type;
              checks.breaker_format_exit = exit;
            },
            ssh: function (command, labels, exit) {
              checks.breaker_ssh_command = command;
              checks.breaker_ssh_labels = labels;
              checks.breaker_ssh_exit = exit;
            }
          };
        }
      },
      globals: {
        process: bag.mock.process(checks, mocks)
      }
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {
      process_cwd: '/somedir/breaker'
    };
    cli = create(checks, mocks);
    cli.exec();
  });

  describe('exec', function () {

    it('should contain init command and delegate to breaker init when exec is called', function () {
      checks.bag_parse_commands.init.desc.should.equal('Create sample Breaker hosts file');
      checks.bag_parse_commands.init.action();
      checks.breaker_init_exit.should.be.a('function');
    });

    it('should contain format command with default type and delegate to breaker format when exec is called', function () {
      checks.bag_parse_commands.format.desc.should.equal('Format hosts info into specific type');
      checks.bag_parse_commands.format.options[0].arg.should.equal('-t, --type <type>');
      checks.bag_parse_commands.format.options[0].desc.should.equal('Format type');
      checks.bag_parse_commands.format.action({});
      checks.breaker_format_type.should.equal('sshconfig');
      checks.breaker_format_exit.should.be.a('function');
    });

    it('should contain format command with type when args contain specified type', function () {
      checks.bag_parse_commands.format.desc.should.equal('Format hosts info into specific type');
      checks.bag_parse_commands.format.action({ type: 'clusterssh' });
      checks.breaker_format_type.should.equal('clusterssh');
      checks.breaker_format_exit.should.be.a('function');
    });

    it('should contain ssh command and delegate to breaker ssh when exec is called', function () {
      checks.bag_parse_commands.ssh.desc.should.equal('Remotely execute shell command on selected configured hosts in parallel via SSH');
      checks.bag_parse_commands.ssh.options[0].arg.should.equal('-l, --labels <labels>');
      checks.bag_parse_commands.ssh.options[0].desc.should.equal('Comma separated labels');
      checks.bag_parse_commands.ssh.action('df -kh;', { labels: 'foo,bar' });
      checks.breaker_ssh_command.should.equal('df -kh;');
      checks.breaker_ssh_labels.length.should.equal(2);
      checks.breaker_ssh_labels[0].should.equal('foo');
      checks.breaker_ssh_labels[1].should.equal('bar');
      checks.breaker_ssh_exit.should.be.a('function');
    });

    it('should pass empty array labels when labels flag is not specified', function () {
      checks.bag_parse_commands.ssh.action('df -kh;', {});
      checks.breaker_ssh_labels.length.should.equal(0);
    });
  });
});
 