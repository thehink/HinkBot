const util = require('util');
const MongoJS = require('mongojs');
const Config = require('../config/config.json');

const DB = MongoJS(Config.mongodb, ['plugins'])

let models = {};

const defaultData = {
  name: 'Plugin'
};

class Storage{
  constructor(plugin){
    this.db = DB.plugins;
    this.plugin = plugin;
    this.data = {};
  }

  schema(schema){
    return new Promise((resolve, reject) => {
      //schema inherits defaultSchema
      schema = Object.assign(defaultData, schema);

      this.db.findOne({
          name: this.plugin.name
      }, (err, pluginData) => {
        console.log('Data', err, pluginData);
        if(err){
          return reject(err);
        }
        this.data = pluginData;
        resolve(pluginData);
      });
    });
  }


  get(key){
    return new Promise((resolve, reject) => {
      if(!this.data || !this.data[key]){
        return reject(new Error('Error no data'));
      }

      return resolve(this.data[key]);
    });
  }

  set(key, value){
    this.data.set(key, value);
    this.data.save();
  }

  add(arrayKey, value){

  }

  remove(arrayKey, index){

  }

}

module.exports = Storage;
