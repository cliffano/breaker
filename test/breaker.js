var bag = require('bagofcli'),
  Breaker = require('../lib/breaker'),
  buster = require('buster-node'),
  colors = require('colors'),
  fs = require('fs'),
  fsx = require('fs.extra'),
  referee = require('referee'),
  ssh2 = require('ssh2'),
  assert = referee.assert;

buster.testCase('breaker - init', {
  setUp: function () {
    this.mock({});
  },
  'should copy sample .breaker.json file to current directory when init is called': function (done) {
    this.stub(fsx, 'copy', function (src, dest, cb) {
      assert.isTrue(src.match(/\/examples\/.breaker.json$/).length === 1);
      assert.equals(dest, '.breaker.json');
      cb();
    });
    var breaker = new Breaker();
    breaker.init(function (err, result) {
      assert.equals(err, undefined);
      done();
    });
  }
});

buster.testCase('breaker - format', {
  setUp: function () {
    this.mockConsole = this.mock(console);
  },
  'should use specified typed formatter and log output': function (done) {
    this.mockConsole.expects('log').once().withExactArgs('clusters = dev\n\ndev = dev1.com');
    var breaker = new Breaker();
    breaker._config = function () {
      return [{ host: 'dev1.com', labels: ['dev'] }];
    };
    breaker.format('clusterssh', function (err, result) {
      assert.equals(err, undefined);
      done();
    });
  }
});

buster.testCase('breaker - ssh', {
  setUp: function () {
    this.mockBag = this.mock(bag);
    this.mockConsole = this.mock(console);
    this.mockFs = this.mock(fs);
  },
  'should exec ssh command to hosts': function (done) {
    this.mockFs.expects('readFileSync').once().withExactArgs('id_rsa1').returns('id_rsa1_key');
    this.mockFs.expects('readFileSync').once().withExactArgs('id_rsa2').returns('id_rsa2_key');
    this.mockFs.expects('readFileSync').once().withExactArgs('id_rsa3').returns('id_rsa3_key');
    this.mockConsole.expects('log').thrice().withExactArgs('Exit code: 0');
    this.mockConsole.expects('log').thrice().withExactArgs('some info'.green);
    this.mockConsole.expects('error').thrice().withExactArgs('some error'.red);
    this.mockConsole.expects('log').once().withExactArgs('+ %s', 'dev1.com');
    this.mockConsole.expects('log').once().withExactArgs('+ %s', 'dev2.com');
    this.mockConsole.expects('log').once().withExactArgs('+ %s', 'dev3.com');
    var mockConn = {
      connect: function (opts) {
      }
    };
    var mockStream = {
      on: function (event, cb) {
        if (event === 'close') {
          cb('0');
        } else if (event === 'data') {
          cb('some info');
        }
        return mockStream;
      },
      stderr: {
        on: function (event, cb) {
          cb('some error');
        }
      }
    };
    this.stub(ssh2.Client.prototype, 'on', function (event, cb) {
      cb();
      return mockConn;
    });
    this.stub(ssh2.Client.prototype, 'exec', function (command, cb) {
      cb(null, mockStream);
    });
    this.stub(ssh2.Client.prototype, 'end', function () {
      return;
    });
    var breaker = new Breaker();
    breaker._config = function () {
      return [
        { "host": "dev1.com", "ssh": [{ "port": 22, "user": "user1", "key": "id_rsa1" }], "labels": "dev1" },
        { "host": "dev2.com", "ssh": [{ "port": 22, "user": "user2", "key": "id_rsa2" }], "labels": "dev2" },
        { "host": "dev3.com", "ssh": [{ "port": 22, "user": "user3", "key": "id_rsa3" }], "labels": "dev3" }
        ];
    };
    breaker.ssh('df -kh;', function (err, results) {
      assert.equals(err, null);
      done();
    });
  },
  'should pass error when unable to execute command': function (done) {
    this.mockFs.expects('readFileSync').once().withExactArgs('id_rsa1').returns('id_rsa1_key');
    this.mockConsole.expects('log').once().withExactArgs('+ %s', 'dev1.com');
    this.mockConsole.expects('log').once().withExactArgs('+ %s', 'dev2.com');
    this.mockConsole.expects('log').once().withExactArgs('+ %s', 'dev3.com');
    this.stub(ssh2.Client.prototype, 'on', function (event, cb) {
      cb();
      return {
        connect: function (opts) {}
      };
    });
    this.stub(ssh2.Client.prototype, 'exec', function (command, cb) {
      cb(new Error('some error'));
    });
    var breaker = new Breaker();
    breaker._config = function () {
      return [
        { "host": "dev1.com", "ssh": [{ "port": 22, "user": "user1", "key": "id_rsa1" }], "labels": "dev1" },
        { "host": "dev2.com", "ssh": [{ "port": 22, "user": "user2", "key": "id_rsa2" }], "labels": "dev2" },
        { "host": "dev3.com", "ssh": [{ "port": 22, "user": "user3", "key": "id_rsa3" }], "labels": "dev3" }
        ];
    };
    breaker.ssh('df -kh;', function (err, results) {
      assert.equals(err.message, 'some error');
      done();
    });
  },
  'should pass error when exit code is non-zero': function (done) {
    this.mockFs.expects('readFileSync').once().withExactArgs('id_rsa1').returns('id_rsa1_key');
    this.mockConsole.expects('log').once().withExactArgs('Exit code: 1');
    this.mockConsole.expects('log').once().withExactArgs('some info'.green);
    this.mockConsole.expects('error').once().withExactArgs('some error'.red);
    this.mockConsole.expects('log').once().withExactArgs('+ %s', 'dev1.com');
    this.mockConsole.expects('log').once().withExactArgs('+ %s', 'dev2.com');
    this.mockConsole.expects('log').once().withExactArgs('+ %s', 'dev3.com');
    var mockConn = {
      connect: function (opts) {
      }
    };
    var mockStream = {
      on: function (event, cb) {
        if (event === 'close') {
          cb('1');
        } else if (event === 'data') {
          cb('some info');
        }
        return mockStream;
      },
      stderr: {
        on: function (event, cb) {
          cb('some error');
        }
      }
    };
    this.stub(ssh2.Client.prototype, 'on', function (event, cb) {
      cb();
      return mockConn;
    });
    this.stub(ssh2.Client.prototype, 'exec', function (command, cb) {
      cb(null, mockStream);
    });
    this.stub(ssh2.Client.prototype, 'end', function () {
      return;
    });
    var breaker = new Breaker();
    breaker._config = function () {
      return [
        { "host": "dev1.com", "ssh": [{ "port": 22, "user": "user1", "key": "id_rsa1" }], "labels": "dev1" },
        { "host": "dev2.com", "ssh": [{ "port": 22, "user": "user2", "key": "id_rsa2" }], "labels": "dev2" },
        { "host": "dev3.com", "ssh": [{ "port": 22, "user": "user3", "key": "id_rsa3" }], "labels": "dev3" }
        ];
    };
    breaker.ssh('df -kh;', function (err, results) {
      assert.equals(err.message, 'An error occurred when executing command: df -kh;, exit code: 1');
      done();
    });
  }
});

buster.testCase('breaker - _config', {
  setUp: function () {
    this.mockBag = this.mock(bag);
  },
  'should return only config with specified label': function () {
    this.mockBag.expects('lookupFile').once().returns('[' +
      '{"host":"dev1.com","labels":["dev"]},' +
      '{"host":"prod1.com","labels":["prod"]},' +
      '{"host":"dev2.com","labels":["dev","build"]},' +
      '{"host":"test1.com","labels":["test"]}]');
    var filtered = new Breaker({ labels: ['prod'] })._config();
    assert.equals(filtered.length, 1);
    assert.equals(filtered[0].host, 'prod1.com');
  },
  'should return only config with specified label when there are multiple labels': function () {
    this.mockBag.expects('lookupFile').once().returns('[' +
      '{"host":"dev1.com","labels":["dev"]},' +
      '{"host":"prod1.com","labels":["prod"]},' +
      '{"host":"dev2.com","labels":["dev","build"]},' +
      '{"host":"test1.com","labels":["test"]}]');
    var filtered = new Breaker({ labels: ['prod', 'test'] })._config();
    assert.equals(filtered.length, 2);
    assert.equals(filtered[0].host, 'prod1.com');
    assert.equals(filtered[1].host, 'test1.com');
  },
  'should return all config when there is no label': function () {
    this.mockBag.expects('lookupFile').once().returns('[' +
      '{"host":"dev1.com","labels":["dev"]},' +
      '{"host":"prod1.com","labels":["prod"]},' +
      '{"host":"dev2.com","labels":["dev","build"]},' +
      '{"host":"test1.com","labels":["test"]}]');
    var filtered = new Breaker()._config();
    assert.equals(filtered.length, 4);
    assert.equals(filtered[0].host, 'dev1.com');
    assert.equals(filtered[1].host, 'prod1.com');
    assert.equals(filtered[2].host, 'dev2.com');
    assert.equals(filtered[3].host, 'test1.com');
  },
  'should return empty array when config is empty': function () {
    this.mockBag.expects('lookupFile').once().returns('[]');
    var filtered = new Breaker()._config();
    assert.equals(filtered.length, 0);
  },
  'should remove filtered out labels': function () {
    this.mockBag.expects('lookupFile').once().returns('[' +
      '{"host":"dev1.com","labels":["dev"]},' +
      '{"host":"prod1.com","labels":["prod","live"]},' +
      '{"host":"dev2.com","labels":["dev","build"]},' +
      '{"host":"xyz.com","labels":["prod","test","dev","build"]},' +
      '{"host":"test1.com","labels":["ci","test","qa"]}]');
    var filtered = new Breaker({ labels: ['prod', 'test'] })._config();
    assert.equals(filtered.length, 3);
    assert.equals(filtered[0].host, 'prod1.com');
    assert.equals(filtered[0].labels.length, 1);
    assert.equals(filtered[0].labels[0], 'prod');
    assert.equals(filtered[1].host, 'xyz.com');
    assert.equals(filtered[1].labels.length, 2);
    assert.equals(filtered[1].labels[0], 'prod');
    assert.equals(filtered[1].labels[1], 'test');
    assert.equals(filtered[2].host, 'test1.com');
    assert.equals(filtered[2].labels.length, 1);
    assert.equals(filtered[2].labels[0], 'test');
  },
  'should handle regex labels': function () {
    this.mockBag.expects('lookupFile').once().returns('[' +
      '{"host":"dev1.com","labels":["dev"]},' +
      '{"host":"prod1.com","labels":["prod"]},' +
      '{"host":"dev2.com","labels":["dev","build"]},' +
      '{"host":"test1.com","labels":["test"]}]');
    var filtered = new Breaker({ labels: ['.*e.*'] })._config();
    assert.equals(filtered.length, 3);
    assert.equals(filtered[0].host, 'dev1.com');
    assert.equals(filtered[1].host, 'dev2.com');
    assert.equals(filtered[2].host, 'test1.com');
  },
  'should handle position aware labels': function () {
    this.mockBag.expects('lookupFile').once().returns('[' +
      '{"host":"dev1.com","labels":["dev"]},' +
      '{"host":"prod1.com","labels":["prod"]},' +
      '{"host":"dev2.com","labels":["dev","build"]},' +
      '{"host":"test1.com","labels":["test"]}]');
    var filtered = new Breaker({ labels: ['ld$', '^p'] })._config();
    assert.equals(filtered.length, 2);
    assert.equals(filtered[0].host, 'prod1.com');
    assert.equals(filtered[1].host, 'dev2.com');
  },
  'should handle labels containing dash': function () {
    this.mockBag.expects('lookupFile').once().returns('[' +
      '{"host":"dev1.com","labels":["dev-app"]},' +
      '{"host":"prod1.com","labels":["prod-db"]},' +
      '{"host":"dev2.com","labels":["dev-app","build"]},' +
      '{"host":"test1.com","labels":["test-util"]}]');
    var filtered = new Breaker({ labels: ['^dev-', 'whatever'] })._config();
    assert.equals(filtered.length, 2);
    assert.equals(filtered[0].host, 'dev1.com');
    assert.equals(filtered[1].host, 'dev2.com');
  }
});
