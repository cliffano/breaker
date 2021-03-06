var _ = require('lodash'),
  util = require('util');

/**
 * Format configuration data into an SSH config
 * http://nerderati.com/2011/03/simplify-your-life-with-an-ssh-config-file/
 *
 * @param {Object} conf: Breaker configuration data
 */
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

  // map each unique label to a host, then sort by label
  var data = [];
  conf.forEach(function (item) {
    item.labels.forEach(function (label) {
      if (uniques.indexOf(label) >= 0) {
        var map = {};
        map[label] = item;
        data.push(map);
      }
    });
  });

  data.sort(function (o1, o2) {
    return _.keys(o1)[0] > _.keys(o2)[0];
  });

  // format them as paragraphs
  var paragraphs = [];
  data.forEach(function (item) {
    var key = _.keys(item)[0];
    item[key].ssh = item[key].ssh || [];
    item[key].ssh.forEach(function (sshItem) {
      paragraphs.push(util.format('Host %s\n    HostName %s\n%s%s%s\n',
        key,
        item[key].host,
        ((sshItem.key) ? '    IdentityFile ' + sshItem.key + '\n' : ''),
        ((sshItem.user) ? '    User ' + sshItem.user + '\n' : ''),
        ((sshItem.port) ? '    Port ' + sshItem.port + '\n' : '')
        ));
    });
  });

  return paragraphs.join('\n');
}

exports.format = format;