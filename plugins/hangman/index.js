const Plugin = require('../../lib/plugin');

//Reload requirement from memory
if(require.cache[require.resolve('./hangman')])
  delete require.cache[require.resolve('./hangman')];

const HangmanGame = require('./hangman');

const Words = require('./words.json').filter(word => {
  return word.length > 3 && !(/\d|'/.test(word));
});


class Hangman extends Plugin{
  constructor(){
    super();
    this.setName('Hangman');
    this.setVersion('0.0.1');
    this.setPrefix('&');
    this.addCommand('hangman', this.hangman);
    this.addCommand('guess {letterOrWord}', this.word);

    this.instances = {};
  }

  hangman(message){
    let instance = this.instances[message.channel.id];
    if(instance && !instance.gameOver){
      return message.reply(instance.getStatus());
    }

    let word = Words[Math.floor(Math.random()*Words.length)];

    if(!instance){
      instance = this.instances[message.channel.id] = new HangmanGame(word);
    }else{
      instance.reset(word);
    }


    message.reply(`New Game Started. ${instance.getStatus()}`);
  }

  word(message, params){
    let letter = params.letterOrWord;
    let instance = this.instances[message.channel.id];
    if(!instance){
      return message.reply('No Hangman game active');
    }

    let response = instance.guess(letter);
    message.reply(`${response} ${instance.getStatus()}`);
  }

}

module.exports = Hangman;
