var bag = require('bagofholding'),
  buster = require('buster'),
  formatter = require('../../lib/formatters/sshconfig');

buster.testCase('sshconfig - format', {
  'should return empty string when conf does not have any host': function () {
    var conf = [];
    assert.equals(formatter.format(conf), '');
  },
  'should format config paragraph when conf only has a single host': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', user: 'user1', key: 'path/to/key1', labels: [ 'dev1' ] }
    ];
    assert.equals(formatter.format(conf), 'Host dev1\n    HostName dev1.com\n    User user1');
  },
  'should not include host which label is used by multiple hosts': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', user: 'user1', key: 'path/to/key1', labels: [ 'dev1' ] },
      { host: 'dev2.com', desc: 'dev2desc', user: 'user2', key: 'path/to/key2', labels: [ 'shared' ] },
      { host: 'dev3.com', desc: 'dev3desc', user: 'user3', key: 'path/to/key3', labels: [ 'shared' ] }
    ];
    assert.equals(formatter.format(conf), 'Host dev1\n    HostName dev1.com\n    User user1');
  },
  'should sort by label when there are multiple config paragraphs': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', user: 'user1', key: 'path/to/key1', labels: [ 'ccc' ] },
      { host: 'dev2.com', desc: 'dev2desc', user: 'user2', key: 'path/to/key2', labels: [ 'aaa' ] },
      { host: 'dev3.com', desc: 'dev3desc', user: 'user3', key: 'path/to/key3', labels: [ 'bbb' ] }
    ];
    assert.equals(formatter.format(conf), 
      'Host aaa\n    HostName dev2.com\n    User user2\n\n' +
      'Host bbb\n    HostName dev3.com\n    User user3\n\n' +
      'Host ccc\n    HostName dev1.com\n    User user1'
    );
  }
});