var bag = require('bagofholding'),
  should = require('should'),
  formatter = require('../../lib/formatters/clusterssh');

describe('clusterssh', function () {

  describe('format', function () {

    it('should return empty string when conf does not have any host', function () {
      formatter.format([]).should.equal('');
    });

    it('should format lines with clusters header', function () {
      var conf = [
        { host: 'dev1.com', desc: 'dev1desc', user: 'user1', key: 'path/to/key1', labels: [ 'dev1' ] }
      ];
      formatter.format(conf).should.equal('clusters = dev1\n\ndev1 = dev1.com');
    });

    it('should group hosts by label', function () {
      var conf = [
        { host: 'dev1.com', desc: 'dev1desc', ssh: { user: 'user1', key: 'path/to/key1' }, labels: [ 'dev1' ] },
        { host: 'dev2.com', desc: 'dev2desc', ssh: { user: 'user2', key: 'path/to/key2' }, labels: [ 'shared' ] },
        { host: 'dev3.com', desc: 'dev3desc', ssh: { user: 'user3', key: 'path/to/key3' }, labels: [ 'shared' ] }
      ];
      formatter.format(conf).should.equal('clusters = dev1 shared\n\ndev1 = dev1.com\nshared = dev2.com dev3.com');
    });

    it('should sort by host when there are multiple hosts', function () {
      var conf = [
        { host: 'dev1.com', desc: 'dev1desc', ssh: { user: 'user1', key: 'path/to/key1' }, labels: [ 'ccc' ] },
        { host: 'dev2.com', desc: 'dev2desc', ssh: { user: 'user2', key: 'path/to/key2' }, labels: [ 'aaa' ] },
        { host: 'dev3.com', desc: 'dev3desc', ssh: { user: 'user3', key: 'path/to/key3' }, labels: [ 'bbb' ] }
      ];
      formatter.format(conf).should.equal('clusters = aaa bbb ccc\n\naaa = dev2.com\nbbb = dev3.com\nccc = dev1.com');
    });

    it('should exclude non-ssh host', function () {
      var conf = [
        { host: 'dev1.com', desc: 'dev1desc', ssh: { user: 'user1', key: 'path/to/key1' }, labels: [ 'ccc' ] },
        { host: 'dev2.com', desc: 'dev2desc', labels: [ 'aaa' ] },
        { host: 'dev3.com', desc: 'dev3desc', ssh: { user: 'user3', key: 'path/to/key3' }, labels: [ 'bbb' ] }
      ];
      console.dir(formatter.format(conf))
      formatter.format(conf).should.equal('clusters = bbb ccc\n\nbbb = dev3.com\nccc = dev1.com');
    });
  });

});
 