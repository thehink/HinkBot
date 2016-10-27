const util = require('util');
const Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;
const Config = require('../config/config.json');
const DB = Mongoose.connect(Config.mongodb);

let models = {};



const defaultSchema = {
  name: String
};

class Storage{
  constructor(plugin){
    this.db = DB;
    this.plugin = plugin;
    this.data = {};
  }

  schema(schema){
    return new Promise((resolve, reject) => {
      //schema inherits defaultSchema
      schema = Object.assign(schema, defaultSchema);

      let pluginSchema = Mongoose.Schema(schema);

      //hack to recompile model
      let modelName = 'Plugin' + this.plugin.name;
      if(Mongoose.models[modelName]){
        delete Mongoose.models[modelName];
      }

      if(Mongoose.modelSchemas[modelName]){
        delete Mongoose.modelSchemas[modelName];
      }

      this._model = Mongoose.model(modelName, pluginSchema);

      this._model.findOne({name: this.plugin.name}).exec().then(pluginData => {
        if(!pluginData){
          pluginData = new this._model({name: this.plugin.name});
          return pluginData.save();
        }
        this.data = pluginData;
        resolve(pluginData);
        return pluginData;
      }).catch(error => {
        console.log('ERROR', error)
        reject(error);
      });
    });
  }


  get(key){
    return this.data.get(key);
  }

  set(key, value){
    this.data.set(key, value);
    this.data.save();
  }

  unset(){

  }

  add(arrayKey, value){
    if(this.data[arrayKey] instanceof Array){
      this.data[arrayKey].push(value);
      this.data.save();
    }
  }

  remove(arrayKey, index){
    if(this.data[arrayKey] instanceof Array){
      this.data[arrayKey].splice(index, 1);
    }
  }

}

module.exports = Storage;
