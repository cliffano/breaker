var cly = require('cly');

function _separator(key) {
  return separator = '************************\n[' + key + ']';
}

function script(file, user, host, cb) {
  cly.exec(
    'echo \'' + _separator(host) + '\'; ssh ' + ((user) ? user + '@' : '') + host + ' \'bash -s\' < ' + file + '.sh',
    true, cb);
}

function command(instruction, user, host, cb) {
  cly.exec(
    'echo \'' + _separator(host) + '\'; ssh ' + ((user) ? user + '@' : '') + host + ' \'' + instruction + '\'',
    true, cb); 
}

exports.script = script;
exports.command = command;