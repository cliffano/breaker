var bag = require('bagofcli'),
  Breaker = require('../lib/breaker'),
  buster = require('buster-node'),
  cli = require('../lib/cli'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('cli - exec', {
  'should contain commands with actions': function (done) {
    var mockCommand = function (base, actions) {
      assert.defined(base);
      assert.defined(actions.commands.init.action);
      assert.defined(actions.commands.format.action);
      assert.defined(actions.commands.ssh.action);
      done();
    };
    this.stub(bag, 'command', mockCommand);
    cli.exec();
  }
});

buster.testCase('cli - init', {
  setUp: function () {
    this.mockConsole = this.mock(console);
  },
  'should contain init command and delegate to breaker init when exec is called': function (done) {
    this.mockConsole.expects('log').once().withExactArgs('Creating sample Breaker hosts file: .breaker.json');
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.init.action();
    });
    this.stub(Breaker.prototype, 'init', function (cb) {
      assert.equals(typeof cb, 'function');
      done();
    });
    cli.exec();
  }
});

buster.testCase('cli - format', {
  'should contain format command and delegate to breaker format when exec is called': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.format.action();
    });
    this.stub(Breaker.prototype, 'format', function (type, cb) {
      assert.equals(type, 'sshconfig');
      assert.equals(typeof cb, 'function');
      done();
    });
    cli.exec();
  },
  'should use custom type when passed via args': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.format.action({ type: 'clusterssh' });
    });
    this.stub(Breaker.prototype, 'format', function (type, cb) {
      assert.equals(type, 'clusterssh');
      assert.equals(typeof cb, 'function');
      done();
    });
    cli.exec();
  },
  'should pass labels array via constructor when argument labels are provided': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.format.action({ labels: 'foo,bar' });
    });
    this.stub(Breaker.prototype, 'format', function (type, cb) {
      assert.equals(this.opts.labels.length, 2);
      assert.equals(this.opts.labels[0], 'foo');
      assert.equals(this.opts.labels[1], 'bar');
      done();
    });
    cli.exec();
  }
});

buster.testCase('cli - ssh', {
  'should contain ssh command and delegate to breaker ssh when exec is called': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.ssh.action('df -kh');
    });
    this.stub(Breaker.prototype, 'ssh', function (command, cb) {
      assert.equals(command, 'df -kh');
      assert.equals(typeof cb, 'function');
      done();
    });
    cli.exec();
  },
  'should pass labels array via constructor when argument labels are provided': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.ssh.action('df -kh', { labels: 'foo,bar' });
    });
    this.stub(Breaker.prototype, 'ssh', function (command, cb) {
      assert.equals(this.opts.labels.length, 2);
      assert.equals(this.opts.labels[0], 'foo');
      assert.equals(this.opts.labels[1], 'bar');
      done();
    });
    cli.exec();
  }
});
