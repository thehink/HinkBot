const Plugin = require('../../lib/plugin');
const psn = require('./psn');

class Psn extends Plugin{
  constructor(){
    super();
    this.setName('Psn');
    this.setVersion('0.0.2');
    this.setPrefix('&');
    this.addCommand('psn-status {username}', this.stalk);
    //this.addCommand('stalkfriends', this.stalkFriends);
    this.addCommand('psn-stalk {username}', this.stalk);
    this.addCommand('psn-info', this.info);
  }

  subscribe(){

  }

  stalkFriends(message, params){
    //params.username
    psn.getFriends({
          user: 'me'
      },
      {
        userFilter:	'online',
        offset:	0,
        limit:	5
      }).then(response => {
        let friends = response.profiles;
        let asaf = friends.map(profile => {
          return profile.onlineId + ' playing ' + profile.presences[0].titleName + ', ' + profile.presences[0].gameStatus;
        });

      message.reply(asaf.join('\n'));
    }).catch(error => {
      message.reply(error.message);
    });
  }

  stalk(message, params){
    //params.username

    psn.getProfile({
          user: params.username
      },
      {})
      .then(resp => {
          return resp.profile;
      }).then(profile => {
        let onlineId = profile.onlineId;
        let presence = profile.presences && profile.presences[0] || [{}];
        let online = profile.primaryOnlineStatus === 'online';
        let online2 = presence.onlineStatus === 'online';
        if(presence.titleName){
          message.reply(profile.onlineId + ' is playing ' + presence.titleName + '' + (presence.gameStatus ? ', ' + presence.gameStatus : ''));
        }else if(online2){
          message.reply(profile.onlineId +' is online(' + presence.platform + ')');
        }else{
          message.reply(profile.onlineId + ' is offline or not a friend');
        }

      }).catch(error => {
        message.reply(error.message);
      });
  }

  info(message){
    //console.log(message.channel.permissionsFor(message.author).serialize());
    message.reply('Whaaat');
  }
}

module.exports = Psn;
