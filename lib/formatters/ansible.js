var _ = require('lodash');

/**
 * Format configuration data into an Ansible inventory
 * http://ansible.cc/docs/patterns.html#hosts-and-groups
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

  // format sorted groups with one line per host
  var lines = [];
  data.forEach(function (item) {
    _.keys(item).forEach(function (label) {
      lines.push('[' + label + ']');
      lines.push(item[label].join('\n') + '\n');
    });
  });

  return lines.join('\n');
}

exports.format = format;