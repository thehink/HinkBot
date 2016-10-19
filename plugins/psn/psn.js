const psnApi = require('psn-api');
const PsnConfig = require('./config.json');

let psn = new psnApi(PsnConfig.email, PsnConfig.password);

psn.login().then(profile => {
  return profile;
})
.catch(error => {
    console.log(error);
});


module.exports = psn;
