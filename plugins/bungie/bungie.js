const fetch = require('node-fetch');

let BungieAPI = {
}

let options = {
  method: 'GET',
  headers: {
    'X-API-Key': '09b3786caf10430c88dc8f23a74ec21e',
  }
}

//https://www.bungie.net/platform/GlobalAlerts/?includestreaming=true&lc=en
BungieAPI.getAlerts = () => {
  let url = 'https://www.bungie.net/platform/GlobalAlerts/?includestreaming=true&lc=en';

  return fetch(url, options).then(response => {
    if(response.status >= 400){
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(json => {
    if(json.Message !== 'Ok'){
      throw new Error(json.Message);
    }
    return json.Response;
  });
}

/*

{
    "Response": [{
        "AlertKey": "PatchingWithDrain",
        "AlertHtml": "Pardon our dust! We are pushing a patch live today. Players will be required to log in to Destiny again after returning to the title screen to install the patch. You should not be removed from any activities you are currently in.",
        "AlertTimestamp": "2016-10-18T12:57:15Z",
        "AlertLevel": 2,
        "AlertType": 0
    }],
    "ErrorCode": 1,
    "ThrottleSeconds": 0,
    "ErrorStatus": "Success",
    "Message": "Ok",
    "MessageData": {}
}

*/

module.exports = BungieAPI;
