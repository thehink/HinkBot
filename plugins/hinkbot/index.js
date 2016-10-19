const Plugin = require('../../lib/plugin');
const PluginHandler = require('../../lib/pluginHandler');

class Base extends Plugin{
  constructor(){
    super();
    this.protected = true; //cant unload
    this.setName('HinkBot');
    this.setVersion('0.0.2');
    this.setPrefix('&');
    this.addCommand('load {plugin:string}', this.load, ['ADMINISTRATOR', 'Thehink#0253']);
    this.addCommand('unload {plugin:string}', this.unload, ['ADMINISTRATOR', 'Thehink#0253']);
    this.addCommand('reload {plugin:string}', this.reload, ['ADMINISTRATOR', 'Thehink#0253']);
    this.addCommand('listplugins', this.listPlugins, ['ADMINISTRATOR', 'Thehink#0253']);
    this.addCommand('commands {plugin}', this.listCommands);
  }

  listCommands(message, params){
    PluginHandler.getPlugin(params.plugin).then(plugin => {
      let msg = '\n';
      for(var i in plugin.commands){
        msg += plugin.prefix + plugin.commands[i].commandStr + '\n';
      }
      message.reply(msg);
    });
  }

  listPlugins(message){
    let msg = '\n';
    PluginHandler.plugins.forEach(plugin => {
      msg += plugin.name + ' - v' + plugin.version + '\n';
    });
    message.reply(msg);
  }

  load(message, params){
    PluginHandler.loadPlugin(params.plugin).then(()=>{
      message.reply('Plugin loaded');
    }).catch(error=>{
      message.reply(error.message);
    });
  }

  unload(message, params){
    PluginHandler.unloadPlugin(params.plugin).then(()=>{
      message.reply('Plugin unloaded');
    }).catch(error=>{
      message.reply(error.message);
    });
  }

  reload(message, params){
    PluginHandler.reloadPlugin(params.plugin).then(()=>{
      message.reply('Plugin reloaded');
    }).catch(error=>{
      message.reply(error.message);
    });
  }

}

module.exports = Base;
