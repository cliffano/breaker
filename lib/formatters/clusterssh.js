var _ = require('underscore'),
  file = '.csshrc';

function format(conf) {

  // group hosts by label
  var groups = {};
  conf.forEach(function (item) {
    item.labels.forEach(function (label) {
      if (groups[label]) {
        groups[label].push(item.host);
      } else {
        groups[label] = [ item.host ];
      }
    });
  });

  // sort data by host
  var data = [];
  _.keys(groups).forEach(function (item) {
    var o = {};
    o[item] = groups[item];
    data.push(o);
  });
  data.sort(function (o1, o2) {
    return _.keys(o1)[0] > _.keys(o2)[0];
  });

  // format data as lines
  var labels = [],
    lines = [];
  data.forEach(function (item) {
    _.keys(item).forEach(function (label) {
      labels.push(label);
      lines.push(label + ' = ' + item[label].join(' '));
    });
  });
  lines.unshift('clusters = ' + labels.join(' ') + '\n');

  return lines.join('\n');
}

exports.format = format;
exports.file = file;