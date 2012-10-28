var _ = require('underscore'),
  file = 'config';

function format(conf) {

  // get unique labels
  var labels = [],
    uniques = [];
  conf.forEach(function (item) {
    labels = labels.concat(item.labels);
  });
  labels.forEach(function (label) {
    if (labels.indexOf(label) === labels.lastIndexOf(label)) {
      uniques.push(label);
    }
  });

  // map each unique label with a host
  var data = {};
  conf.forEach(function (item) {
    item.labels.forEach(function (label) {
      if (uniques.indexOf(label) >= 0) {
        data[label] = item;
      }
    });
  });

  // format them as paragraphs, then sort
  var paragraphs = [];
  _.keys(data).forEach(function (item) {
    paragraphs.push('Host ' + item
      + '\n    HostName ' + data[item].host
      + '\n    User ' + data[item].user);
  });

  return paragraphs.join('\n\n');
}

exports.format = format;
exports.file = file;