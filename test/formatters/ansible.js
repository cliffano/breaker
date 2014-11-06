var buster = require('buster-node'),
  formatter = require('../../lib/formatters/ansible'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('ansible - format', {
  setUp: function () {
    this.mock({});
  },
  'should return empty string when conf does not have any host': function () {
    var conf = [];
    assert.equals(formatter.format(conf), '');
  },
  'should format lines with clusters header': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', user: 'user1', key: 'path/to/key1', labels: [ 'dev1' ] }
    ];
    assert.equals(formatter.format(conf), '[dev1]\ndev1.com\n');
  },
  'should group hosts by label': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', ssh: { user: 'user1', key: 'path/to/key1' }, labels: [ 'dev1' ] },
      { host: 'dev2.com', desc: 'dev2desc', ssh: { user: 'user2', key: 'path/to/key2' }, labels: [ 'shared' ] },
      { host: 'dev3.com', desc: 'dev3desc', ssh: { user: 'user3', key: 'path/to/key3' }, labels: [ 'shared' ] }
    ];
    assert.equals(formatter.format(conf), '[dev1]\ndev1.com\n\n[shared]\ndev2.com\ndev3.com\n');
  },
  'should sort by host when there are multiple hosts': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', ssh: { user: 'user1', key: 'path/to/key1' }, labels: [ 'ccc' ] },
      { host: 'dev2.com', desc: 'dev2desc', ssh: { user: 'user2', key: 'path/to/key2' }, labels: [ 'aaa' ] },
      { host: 'dev3.com', desc: 'dev3desc', ssh: { user: 'user3', key: 'path/to/key3' }, labels: [ 'bbb' ] }
    ];
    assert.equals(formatter.format(conf), '[aaa]\ndev2.com\n\n[bbb]\ndev3.com\n\n[ccc]\ndev1.com\n');
  },
  'should exclude non-ssh host': function () {
    var conf = [
      { host: 'dev1.com', desc: 'dev1desc', ssh: { user: 'user1', key: 'path/to/key1' }, labels: [ 'ccc' ] },
      { host: 'dev2.com', desc: 'dev2desc', labels: [ 'aaa' ] },
      { host: 'dev3.com', desc: 'dev3desc', ssh: { user: 'user3', key: 'path/to/key3' }, labels: [ 'bbb' ] }
    ];
    assert.equals(formatter.format(conf), '[aaa]\ndev2.com\n\n[bbb]\ndev3.com\n\n[ccc]\ndev1.com\n');
  }
});
