var bag = require('bagofholding'),
  should = require('should'),
  formatter = require('../../lib/formatters/sshconfig');

describe('sshconfig', function () {

  describe('file', function () {
    it('should specify a file name', function () {
      formatter.file.should.equal('config');
    });
  });

  describe('format', function () {

    it('should return empty string when conf does not have any host', function () {
      formatter.format([]).should.equal('');
    });

    it('should format config paragraph when conf only has a single host', function () {
      var conf = [
        { host: 'dev1.com', desc: 'dev1desc', user: 'user1', key: 'path/to/key1', labels: [ 'dev1' ] }
      ];
      formatter.format(conf).should.equal('Host dev1\n    HostName dev1.com\n    User user1');
    });

    it('should not include host which label is used by multiple hosts', function () {
      var conf = [
        { host: 'dev1.com', desc: 'dev1desc', user: 'user1', key: 'path/to/key1', labels: [ 'dev1' ] },
        { host: 'dev2.com', desc: 'dev2desc', user: 'user2', key: 'path/to/key2', labels: [ 'shared' ] },
        { host: 'dev3.com', desc: 'dev3desc', user: 'user3', key: 'path/to/key3', labels: [ 'shared' ] }
      ];
      formatter.format(conf).should.equal('Host dev1\n    HostName dev1.com\n    User user1');
    });

    it('should sort by label when there are multiple config paragraphs', function () {
      var conf = [
        { host: 'dev1.com', desc: 'dev1desc', user: 'user1', key: 'path/to/key1', labels: [ 'ccc' ] },
        { host: 'dev2.com', desc: 'dev2desc', user: 'user2', key: 'path/to/key2', labels: [ 'aaa' ] },
        { host: 'dev3.com', desc: 'dev3desc', user: 'user3', key: 'path/to/key3', labels: [ 'bbb' ] }
      ];
      formatter.format(conf).should.equal(
        'Host aaa\n    HostName dev2.com\n    User user2\n\n' +
        'Host bbb\n    HostName dev3.com\n    User user3\n\n' +
        'Host ccc\n    HostName dev1.com\n    User user1'
      );
    });
  });
});
 