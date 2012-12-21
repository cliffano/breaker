var _ = require('underscore');

/**
 * Format configuration data into a clusterssh config
 * http://www.debianadmin.com/ssh-on-multiple-servers-using-cluster-ssh.html
 *
 * @param {Object} conf: Breaker configuration data
 */
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

  // sort groups by label
  var data = [];
  _.keys(groups).forEach(function (label) {
    var group = {};
    group[label] = groups[label];
    data.push(group);
  });
  data.sort(function (o1, o2) {
    return _.keys(o1)[0] > _.keys(o2)[0];
  });

  // format sorted groups as lines
  var labels = [],
    lines = [];
  data.forEach(function (item) {
    _.keys(item).forEach(function (label) {
      labels.push(label);
      lines.push(label + ' = ' + item[label].join(' '));
    });
  });
  if (lines.length >= 1) {
    lines.unshift('clusters = ' + labels.join(' ') + '\n');
  }

  return lines.join('\n');
}

exports.format = format;