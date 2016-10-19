const util = require('util');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Config = require('../config/config.json');

const DB = Mongoose.createConnection(Config.mongodb);

let models = {};

const defaultSchema = {
  name: String
};

class Storage{
  constructor(plugin){
    this.db = DB;
    this.plugin = plugin;
  }

  schema(schema){
    return new Promise((resolve, reject) => {
      //schema inherits defaultSchema
      schema = Object.assign(defaultSchema, schema);
      this._schema = new Schema(schema);
      this._model = Mongoose.model('Plugin_' + this.plugin.name, this._schema);
      console.log('Trying to get plugin data...');

      let silence = new this._model({ name: this.plugin.name });
      silence.save(function (err, fluffy) {
        if (err) return console.error(err);
        console.log(fluffy);
      });

      this._model.findOne({
          name: this.plugin.name
        }, (err, pluginData) => {
            console.log('Data', err, pluginData);
            if(err) return reject(err);
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
