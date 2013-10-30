var buster = require('buster-node'),
  formatter = require('../../lib/formatters/sshconfig'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('sshconfig - format', {
  'should return empty string when conf does not have any host': function () {
    var conf = [];
    assert.equals(formatter.format(conf), '');
  },
  'should format config paragraph when conf only has a single host': function () {
    var conf = [
      { host: 'dev1.com', ssh: [{ user: 'user1', port: 2222, key: 'path/to/key1' }], labels: [ 'dev1' ] }
    ];
    assert.equals(formatter.format(conf), 'Host dev1\n    HostName dev1.com\n    IdentityFile path/to/key1\n    User user1\n    Port 2222\n\n');
  },
  'should not include host which label is used by multiple hosts': function () {
    var conf = [
      { host: 'dev1.com', ssh: [{ user: 'user1', key: 'path/to/key1' }], labels: [ 'dev1' ] },
      { host: 'dev2.com', ssh: [{ user: 'user2', key: 'path/to/key2' }], labels: [ 'shared' ] },
      { host: 'dev3.com', ssh: [{ user: 'user3', key: 'path/to/key3' }], labels: [ 'shared' ] }
    ];
    assert.equals(formatter.format(conf), 'Host dev1\n    HostName dev1.com\n    IdentityFile path/to/key1\n    User user1\n\n');
  },
  'should sort by label when there are multiple config paragraphs': function () {
    var conf = [
      { host: 'dev1.com', ssh: [{ user: 'user1' }], labels: [ 'ccc' ] },
      { host: 'dev2.com', ssh: [{ user: 'user2' }], labels: [ 'aaa' ] },
      { host: 'dev3.com', ssh: [{ user: 'user3' }], labels: [ 'bbb' ] }
    ];
    assert.equals(formatter.format(conf), 
      'Host aaa\n    HostName dev2.com\n    User user2\n\n\n' +
      'Host bbb\n    HostName dev3.com\n    User user3\n\n\n' +
      'Host ccc\n    HostName dev1.com\n    User user1\n\n'
    );
  },
  'should format config without key, user, and port': function () {
    var conf = [
      { host: 'dev1.com', ssh: [{}], labels: [ 'dev1' ] }
    ];
    assert.equals(formatter.format(conf), 'Host dev1\n    HostName dev1.com\n\n');
  },
  'should format config without ssh as empty string': function () {
    var conf = [
      { host: 'dev1.com', labels: [ 'dev1' ] }
    ];
    assert.equals(formatter.format(conf), '');
  }
});
