var bag = require('bagofholding'),
  _jscov = require('../lib/breaker'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  breaker;

describe('breaker', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/breaker', {
      requires: mocks.requires,
      globals: {
        console: bag.mock.console(checks),
        process: bag.mock.process(checks, mocks)
      },
      locals: {
        __dirname: '/somedir/breaker/lib'
      }
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {};
  });

  describe('init', function () {

    it('should copy sample .breaker.json file to current directory when init is called', function (done) {
      mocks.requires = {
        'fs.extra': {
          copy: function (source, target, cb) {
            checks.fsx_copy_source = source;
            checks.fsx_copy_target = target;
            cb();
          }
        }
      };
      breaker = new (create(checks, mocks))();
      breaker.init(function () {
        done();
      }); 
      checks.fsx_copy_source.should.equal('/somedir/breaker/examples/.breaker.json');
      checks.fsx_copy_target.should.equal('.breaker.json');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Creating sample Breaker hosts file: .breaker.json');
    });
  });

  describe('format', function () {

    it('should use specified formatter and log formatted output when format is called', function (done) {
      mocks.requires = {
        'bagofholding': {
          cli: {
            readConfigFileSync: function (file) {
              checks.cli_file = file;
              return '[{ "foo": "bar" }]';
            }
          }
        },
        './formatters/sshboom': {
          format: function (conf) {
            checks.format_conf = conf;
            return 'some formatted output';
          }
        }
      };
      breaker = new (create(checks, mocks))();
      breaker.format('sshboom', function () {
        done();
      }); 
      checks.format_conf[0].foo.should.equal('bar');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('some formatted output');
    }); 
  });

  describe('ssh', function () {

    it('should exec ssh command to all hosts when labels are not supplied', function (done) {
      checks.exec_commands = [];
      mocks.requires = {
        'bagofholding': {
          cli: {
            readConfigFileSync: function (file) {
              checks.cli_file = file;
              return '[' +
                '{ "host": "dev1.json", "port": 22, "user": "user1", "key": "id_rsa1", "labels": "dev1" },' +
                '{ "host": "dev2.json", "port": 22, "user": "user2", "key": "id_rsa2", "labels": "dev2" },' +
                '{ "host": "dev3.json", "port": 22, "user": "user3", "key": "id_rsa3", "labels": "dev3" }' +
                ']';
            },
            exec: function (command, fallthrough, cb) {
              fallthrough.should.equal(true);
              checks.exec_commands.push(command);
              cb();
            }
          }
        }
      };
      breaker = new (create(checks, mocks))();
      breaker.ssh('df -kh;', undefined, function () {
        done();
      }); 
      checks.console_log_messages.length.should.equal(3);
      checks.console_log_messages[0].should.equal('+ dev1.json');
      checks.console_log_messages[1].should.equal('+ dev2.json');
      checks.console_log_messages[2].should.equal('+ dev3.json');
      checks.exec_commands.length.should.equal(3);
      checks.exec_commands[0].should.equal('ssh -i id_rsa1 user1@dev1.json:22 \'df -kh;\'');
      checks.exec_commands[1].should.equal('ssh -i id_rsa2 user2@dev2.json:22 \'df -kh;\'');
      checks.exec_commands[2].should.equal('ssh -i id_rsa3 user3@dev3.json:22 \'df -kh;\'');
    }); 

    it('should construct command without key, user, and port when they are not configured', function (done) {
      checks.exec_commands = [];
      mocks.requires = {
        'bagofholding': {
          cli: {
            readConfigFileSync: function (file) {
              checks.cli_file = file;
              return '[' +
                '{ "host": "dev1.json", "labels": "dev1" }' +
                ']';
            },
            exec: function (command, fallthrough, cb) {
              fallthrough.should.equal(true);
              checks.exec_commands.push(command);
              cb();
            }
          }
        }
      };
      breaker = new (create(checks, mocks))();
      breaker.ssh('df -kh;', undefined, function () {
        done();
      }); 
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('+ dev1.json');
      checks.exec_commands.length.should.equal(1);
      checks.exec_commands[0].should.equal('ssh  dev1.json \'df -kh;\'');
    }); 

    it('should not execute any command when labels opt do not match any label in configuration', function (done) {
      checks.exec_commands = [];
      mocks.requires = {
        'bagofholding': {
          cli: {
            readConfigFileSync: function (file) {
              checks.cli_file = file;
              return '[' +
                '{ "host": "dev1.json", "labels": "dev1" }' +
                ']';
            },
            exec: function (command, fallthrough, cb) {
              fallthrough.should.equal(true);
              checks.exec_commands.push(command);
              cb();
            }
          }
        }
      };
      breaker = new (create(checks, mocks))();
      breaker.ssh('df -kh;', ['foo1', 'foo2', 'foo3'], function () {
        done();
      }); 
      checks.console_log_messages.length.should.equal(0);
      checks.exec_commands.length.should.equal(0);
    });
  });
});
 