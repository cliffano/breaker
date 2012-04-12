var cly = require('cly'),
  p = require('path'),
  sshm = new require('./sshm').Sshm({ dir: process.cwd() }),
  sshmDir = __dirname;

function exec() {
  
  var commands = {
    'init': {
      callback: function (args) {
        console.log('Creating Sshm hosts and task files');
        cly.copyDir(p.join(sshmDir, '../examples'), '.', cly.exit);
      }
    },
    'x': {
      callback: function (args) {
        if (args._.length === 3) {
          sshm.exec(args[1], args[2].split(','), cly.exit);
        } else {
          console.warn('Usage: sshm x <task|command> <tag>');
        }
      }
    }
  };

  ['tasks', 'hosts', 'tags'].forEach(function (command) {
    commands[command] = {
      callback: function (args) {
        sshm[command](cly.exit);
      }
    };
  });

  cly.parse(__dirname, 'sshm', commands);
}

exports.exec = exec;