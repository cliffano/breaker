var bag = require('bagofholding'),
  should = require('should'),
  formatter = require('../../lib/formatters/clusterssh');

describe('clusterssh', function () {

  describe('file', function () {
    it('should specify a file name', function () {
      formatter.file.should.equal('.csshrc');
    });
  });

});
 