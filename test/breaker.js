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
              return '{ "foo": "bar" }';
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
      checks.format_conf.foo.should.equal('bar');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('some formatted output');
    }); 
  });

});
 