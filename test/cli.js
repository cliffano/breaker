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
            gen: function (format, exit) {
              checks.breaker_gen_format = format;
              checks.breaker_gen_exit = exit;
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

    it('should contain gen command with default format and delegate to breaker gen when exec is called', function () {
      checks.bag_parse_commands.gen.desc.should.equal('Generate hosts info in a specified format');
      checks.bag_parse_commands.gen.action({});
      checks.breaker_gen_format.should.equal('sshconfig');
      checks.breaker_gen_exit.should.be.a('function');
    });

    it('should contain gen command with format when args contain specified format', function () {
      checks.bag_parse_commands.gen.desc.should.equal('Generate hosts info in a specified format');
      checks.bag_parse_commands.gen.action({ format: 'clusterssh' });
      checks.breaker_gen_format.should.equal('clusterssh');
      checks.breaker_gen_exit.should.be.a('function');
    });

  });
});
 