const Plugin = require('../../lib/plugin');


class Quotes extends Plugin{
  constructor(){
    super();
    this.setName('Bungie');
    this.setVersion('0.0.1');
    this.setPrefix('&');
    this.addCommand('&quote {user::optional} {quote::optional}', this.quote, ['ADMINISTRATOR', 'Thehink#0253']);
    this.addCommand('&quote add {quote}', this.add, ['ADMINISTRATOR', 'Thehink#0253']);

    this.storage.schema({
      quotes: Array,
    });
  }

  quote(message, params){

  }

  add(message, params){
    this.storage.add('quotes', params.quote);
    this.storage.remove('quotes', 'index');
    this.storage.set('quotes', params.quote);
    this.storage.get('quotes');
  }

}

module.exports = Quotes;
