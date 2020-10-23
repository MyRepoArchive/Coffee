const client = require('../../..');
const fs = require('fs');
const emojis = require('../../../utils/emojis.json');

module.exports = () => {
  client.emojis.cache.forEach(emoji => {
    if (emoji.animated) {
      emojis.animated.emoji[emoji.name] = `<${emoji.identifier}>`;
      emojis.animated.eID[emoji.name] = emoji.id;
    } else {
      emojis.static.emoji[emoji.name] = `<:${emoji.identifier}>`;
      emojis.static.eID[emoji.name] = emoji.id;
    }
  });


  fs.writeFileSync('./src/utils/emojis.json', JSON.stringify(emojis));
}