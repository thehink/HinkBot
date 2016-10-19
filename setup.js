const recursive = require('recursive-readdir');
const fs = require('fs');

const ConfigFolder = './config/';
const PluginConfigFolder = './plugins/';

/*
fs.readdir(ConfigFolder, (err, files) => {
  files.forEach(file => {
    let f = file.split('.');
    if(f[f.length-1] == 'default'){
      fs.createReadStream(ConfigFolder + file).pipe(fs.createWriteStream(ConfigFolder + f[0] + '.json'));
    }
  });
})*/

function writeJson(path, json){
  fs.writeFile(path, JSON.stringify(json, null, 4), function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("Saved", path);
  });
}

function readJson(path, callback){
  fs.readFile(path, 'utf8', (err,data) => {
    if (err) {
      return callback(err);
    }

    callback(null, JSON.parse(data));
  });
}

function Config(path){
  readJson(path, (err, json) => {
    if(err)return console.log('Error, wierd');
    let newPath = path.replace('.default', '');
    readJson(newPath, (err, oldJson) => {
      if(!err){
        for(var key in oldJson){
          if(json[key] !== undefined){
            json[key] = oldJson[key];
          }
        }
      }
      writeJson(newPath, json);
    });

  })
}

// ignore files named 'foo.cs' or files that end in '.html'.
recursive(ConfigFolder, ['*.js', '*.json'], function (err, files) {
  // Files is an array of filename
  files.forEach(file => {
    Config(file);
  });
});


recursive(PluginConfigFolder, ['*.js', '*.json'], function (err, files) {
  // Files is an array of filename
  files.forEach(file => {
    Config(file);
  });
});
