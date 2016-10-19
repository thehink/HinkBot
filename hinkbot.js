const Discord = require('discord.js');
const client = new Discord.Client();
const PluginHandler = require('./lib/pluginHandler');
const Config = require('./config/config.json');

PluginHandler.loadPlugins('./plugins').then(()=>{
  console.log('All plugins loaded, initiating discord client...');

  client.on('ready', () => {
    console.log('Client ready...');
    PluginHandler.trigger('ready', client);
  });

  client.on('message', message => {
    PluginHandler.trigger('message', message);
  });

  client.login(Config.token);
});
//JSON.stringify({ a:1, b:2, c:3 }, null, 4);
