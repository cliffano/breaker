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
    'x': {
      callback: function (args) {
        if (args._.length === 3) {
          shoot.exec(args[1], args[2].split(','), cly.exit);
        } else {
          console.warn('Usage: shoot x <task|command> <tag>');
        }
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