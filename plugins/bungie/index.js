const Plugin = require('../../lib/plugin');

if(require.cache[require.resolve('./bungie')])
  delete require.cache[require.resolve('./bungie')];
const BungieAPI = require('./bungie');

const AlertsText = {
  'PatchingWithDrain': 'Pardon our dust! We are pushing a patch live today!',
}

class Bungie extends Plugin{
  constructor(){
    super();
    this.setName('Bungie');
    this.setVersion('0.0.1');
    this.setPrefix('&');
    this.addCommand('bungie-news', this.news, ['ADMINISTRATOR', 'Thehink#0253']);
    this.addCommand('bungie-alerts', this.status, ['ADMINISTRATOR', 'Thehink#0253']);

    this.storage.schema({
      channels: Array,
    }).then(data => {
      console.log('Got Data');
      this.channels = this.storage.get('channels');
    });

    this.timeout = setInterval(() => {
      this.tick();
    }, 1000*60*5);
  }

  news(){

  }

  status(message, params){
    let channel = this.channels.indexOf(message.channel);

    if(channel > -1){
      this.channels.splice(channel, 1);
      message.reply('Unsubscribed this channel from Bungie alerts');
    }else{
      if(message.channel.type === 'text'){
        this.channels.push(message.channel);
        message.reply('Subscribed this channel-topic to Bungie alerts');
        this.tick();
      }else{
        message.reply('You can only subscribe to topic updates in text channels');
      }

    }

  }

  tick(){
    console.log('Bungie Tick');
    BungieAPI.getAlerts().then(response => {
      if(response[0]){
        this.channels.forEach(channel => {
          channel.setTopic(AlertsText[response[0].AlertKey] || response[0].AlertHtml);
        });
      }else{
        channel.setTopic('');
      }

    }).catch(error => {
      console.log('Error', error.message);
    });
  }

  onDestroy(){
    console.log('Bungie, Destroyed Interval');
    clearInterval(this.timeout);
  }

}

module.exports = Bungie;
