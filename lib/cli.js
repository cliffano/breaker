var cly = require('cly'),
  p = require('path'),
  sshout = new require('./sshout').Sshout({ dir: process.cwd() }),
  sshoutDir = __dirname;

function exec() {
  
  var commands = {
    init: {
      callback: function (args) {
        console.log('Creating Sshout hosts and task files');
        cly.copyDir(p.join(sshoutDir, '../examples'), '.', cly.exit);
      }
    },
    do: {
      callback: function (args) {
        sshout.does(args[1], args[2].split(','), cly.exit);
      }
    }
  };

  ['tasks', 'hosts', 'tags'].forEach(function (command) {
    commands[command] = {
      callback: function (args) {
        sshout[command](cly.exit);
      }
    };
  });

  cly.parse(__dirname, 'sshout', commands);
}

exports.exec = exec;