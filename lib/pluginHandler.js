var fs = require('fs'),
    path = require('path');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function statPath(path) {
  try {
    return fs.lstatSync(path);
  } catch (ex) {}
  return false;
}

let pluginHandler = {
  dir: '../plugins/',
  plugins: []
};

pluginHandler.getPlugin = name => {
  return new Promise(function (resolve, reject) {
    let plugin = pluginHandler.plugins.find(plugin => {return plugin.name.toLowerCase() === name.toLowerCase()});
    if(plugin)
      return resolve(plugin);
    else
      return reject(new Error('Couldnt find plugin'));
  });
}

pluginHandler.loadPlugin = name => {
  return new Promise(function (resolve, reject) {
    console.log('Load plugin', name);
    let pluginClass,
        error;
    try{
      let config = {};
      let configPath = './plugins/' + name + '/config.json';
      let file = statPath(configPath);
      if(file && file.isFile()){
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));;
      }

      if(config.disabled){
        reject(new Error('Plugin '+ name +' is disabled. Enable by setting disabled to true in: ' + configPath));
        return;
      }

      pluginClass = require(pluginHandler.dir + name + '/index');
    }catch(Error){
      error = Error;
    }

    if(error !== undefined)
      return reject(error);


    let loaded = pluginHandler.plugins.some(plugin => {return plugin instanceof pluginClass;});

    if(loaded){
      console.log('[ERROR]', 'Plugin', name, 'already loaded!');
      return reject(new Error('Plugin ' + name + ' was already loaded'));
    }


    let initiated = new pluginClass();
    pluginHandler.plugins.push(initiated);
    pluginHandler.call(initiated, 'load');
    return resolve(initiated);
  });
}

pluginHandler.unloadPlugin = (name, forceUnload) => {
  return new Promise(function (resolve, reject) {
    let pluginIndex = pluginHandler.plugins.findIndex(plugin => {return plugin.name.toLowerCase() === name.toLowerCase()});
    if(pluginIndex < 0){
      return reject(new Error('Couldnt find plugin'));
    }

    if(pluginHandler.plugins[pluginIndex].protected && !forceUnload)
      return reject(new Error('Plugin '+ name +' is protected and cant be unloaded'));

    console.log('Unload Plugin', name);
    pluginHandler.call(pluginHandler.plugins[pluginIndex], 'destroy');
    delete require.cache[require.resolve(pluginHandler.dir + name + '/index')];
    pluginHandler.plugins.splice(pluginIndex, 1);
    return resolve();
  });
}

pluginHandler.reloadPlugin = name => {
  return pluginHandler.unloadPlugin(name, true).then(() => {
    return pluginHandler.loadPlugin(name);
  });
}

pluginHandler.loadPlugins = dir => {
  return Promise.all(getDirectories(dir).map(name => {
    return pluginHandler.loadPlugin(name).catch(error => {
      console.log(error.message);
  });
}));
}

pluginHandler.call = (plugin, name, arg) =>{
  name = name.charAt(0).toUpperCase() + name.slice(1);
  if(typeof(plugin['on'+name]) === 'function')
    plugin['on'+name](arg);
}

pluginHandler.trigger = (event, arg) => {
  event = event.charAt(0).toUpperCase() + event.slice(1);
  pluginHandler.plugins.forEach(plugin => {
    pluginHandler.call(plugin, event, arg);
  });
}

module.exports = pluginHandler;
