const util = require('util');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const defaultSchema = {
  name: String
};

class Storage{
  constructor(connection, plugin){
    this.db = connection;
    this.plugin = plugin;
  }

  schema(schema){
    return new Promise(function (resolve, reject) {
      //schema inherits defaultSchema
      util.inherits(schema, defaultSchema);
      console.log(schema);
      this._schema = new Schema(schema);
      this._model = mongoose.model('Plugin', this._schema);
      this._model.findOne({
        name: this.plugin.name
      }, function(err, pluginData){
        if(err) return reject(err);
        this.data = pluginData;
        resolve(pluginData);
      });
    });
  }


  get(key){
    return new Promise(function (resolve, reject) {
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
