var _ = require('underscore'),
  file = 'config';

function format(conf) {
  var data = {};

  // group hosts by label
  conf.forEach(function (item) {
    item.labels.forEach(function (label) {
      if (data[label]) {
        data[label].push(item);
      } else {
        data[label] = [ item ];
      }
    });
  });

  // format them as paragraphs, then sort
  var paragraphs = [];
  _.keys(data).forEach(function (item) {
    paragraphs.push('Host ' + item
      + '\n    HostName' + data[item].host
      + '\n    User' + data[item].user);
  });
  paragraphs = paragraphs.sort(function (p1, p2) {
    return p1 > p2;
  });

  return paragraphs.join('\n');
}

exports.format = format;
exports.file = file;