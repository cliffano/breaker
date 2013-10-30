var buster = require('buster-node'),
  formatter = require('../../lib/formatters/clusterssh'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('clusterssh - format', {
  'should return empty string when conf does not have any host': function () {
    var conf = [];
    assert.equals(formatter.format(conf), '');
  },
  'should format lines with clusters header': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', user: 'user1', key: 'path/to/key1', labels: [ 'dev1' ] }
    ];
    assert.equals(formatter.format(conf), 'clusters = dev1\n\ndev1 = dev1.com');
  },
  'should group hosts by label': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', ssh: { user: 'user1', key: 'path/to/key1' }, labels: [ 'dev1' ] },
      { host: 'dev2.com', desc: 'dev2desc', ssh: { user: 'user2', key: 'path/to/key2' }, labels: [ 'shared' ] },
      { host: 'dev3.com', desc: 'dev3desc', ssh: { user: 'user3', key: 'path/to/key3' }, labels: [ 'shared' ] }
    ];
    assert.equals(formatter.format(conf), 'clusters = dev1 shared\n\ndev1 = dev1.com\nshared = dev2.com dev3.com');
  },
  'should sort by host when there are multiple hosts': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', ssh: { user: 'user1', key: 'path/to/key1' }, labels: [ 'ccc' ] },
      { host: 'dev2.com', desc: 'dev2desc', ssh: { user: 'user2', key: 'path/to/key2' }, labels: [ 'aaa' ] },
      { host: 'dev3.com', desc: 'dev3desc', ssh: { user: 'user3', key: 'path/to/key3' }, labels: [ 'bbb' ] }
    ];
    assert.equals(formatter.format(conf), 'clusters = aaa bbb ccc\n\naaa = dev2.com\nbbb = dev3.com\nccc = dev1.com');
  },
  'should exclude non-ssh host': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', ssh: { user: 'user1', key: 'path/to/key1' }, labels: [ 'ccc' ] },
      { host: 'dev2.com', desc: 'dev2desc', labels: [ 'aaa' ] },
      { host: 'dev3.com', desc: 'dev3desc', ssh: { user: 'user3', key: 'path/to/key3' }, labels: [ 'bbb' ] }
    ];
    assert.equals(formatter.format(conf), 'clusters = aaa bbb ccc\n\naaa = dev2.com\nbbb = dev3.com\nccc = dev1.com');
  }
});
