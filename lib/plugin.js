const Storage = require('./storage');
const EventEmitter = require('events').EventEmitter;

function parseMessage(command, message){
  let matches = [], found;
  while (found = command.regex.exec(message.replace(command.name, ''))) {
      matches.push(found[1]);
  }

  let params = {};
  command.keys.forEach((key, index) => {
    if(key.required !== 'optional' && !matches[index]){
      if(!params.errors) params.errors = [];
      params.errors.push(key.key + ' is required');
    }
    params[key.key] = matches[index];
  });
  return params;
}

function parseCommand(command){
  let commandName = command.split(' ')[0];

  let regString = ' (\\w+)';
  let reg = /{(\w+):?(\w+)?:?(\w+)?}/g;
  let matches = [], found;
  while (found = reg.exec(command)) {
      matches.push({
        key: found[1],
        type: found[2],
        required: found[3]
      });
  }


  let cmdRegex = new RegExp(regString, 'g');

  return {
    name: commandName,
    regex: cmdRegex,
    commandStr: command,
    keys: matches
  }
}

class Plugin extends EventEmitter {
  constructor(){
    super();
    this.name = 'Plugin';
    this.version = '0.0.1';
    this.commands = {};
    this.prefix = '&';
    this.required = [];
    this.storage = new Storage();
  }

  setVersion(version){
    this.version = version;
  }

  setName(name){
    this.name = name;
  }

  setPrefix(prefix){
    this.prefix = prefix;
  }

  addCommand(command, func, permissions){
    let cmd = parseCommand(command);
    cmd.callback = func;
    cmd.permissions = permissions || [];
    this.commands[cmd.name] = cmd;
  }

  removeCommand(name){
    delete this.commands[name];
  }

  onReady(client){
    this.client = client;
  }

  onMessage(message){
    if(message.content.startsWith(this.prefix)){
      let commandName = message.content.split(' ')[0].replace(this.prefix, '');
      let str = message.content.substr(this.prefix.length, message.content.length);
      let command = this.commands[commandName];

      if(command){
        let permissions = message.channel.type === 'text' && message.channel.permissionsFor(message.author).serialize() || {};
        permissions[message.author.username + '#' + message.author.discriminator] = true;

        let hasPermissions = command.permissions.some(permission => {
          return permissions[permission];
        });

        if(command.permissions.length === 0)
          hasPermissions = true;

        if(!hasPermissions)
          return message.reply('You dont have permissions for this command.\n`' + command.permissions.map(perm => {return permissions[perm] ? perm + ' ✓' : perm}).join('\n') + '`');

        let params = parseMessage(command, str);
        if(params.errors)
          message.reply('Command: ' + command.commandStr);
        else if(command.callback)
          command.callback.call(this, message, params);

        //console.log('Command Exists!', commandName, str);
      }


    }
    //parse message
    //match commands
  }

}

module.exports = Plugin;
