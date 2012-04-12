var cly = require('cly'),
  p = require('path'),
  shoot = new require('./shoot').Shoot({ dir: process.cwd() }),
  shootDir = __dirname;

function exec() {
  
  var commands = {
    'init': {
      callback: function (args) {
        console.log('Creating Shoot hosts and task files');
        cly.copyDir(p.join(shootDir, '../examples'), '.', cly.exit);
      }
    },
    'do': {
      callback: function (args) {
        shoot.does(args[1], args[2].split(','), cly.exit);
      }
    }
  };

  ['tasks', 'hosts', 'tags'].forEach(function (command) {
    commands[command] = {
      callback: function (args) {
        shoot[command](cly.exit);
      }
    };
  });

  cly.parse(__dirname, 'shoot', commands);
}

exports.exec = exec;