var bag = require('bagofholding'),
  should = require('should'),
  formatter = require('../../lib/formatters/sshconfig');

describe('sshconfig', function () {

  describe('file', function () {
    it('should specify a file name', function () {
      formatter.file.should.equal('config');
    });
  });

});
 