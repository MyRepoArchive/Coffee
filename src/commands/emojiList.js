const Discord = require('discord.js');
const hex = require('../../colors.json');
const config = require('../../info.json');
const emojis = require('../../emojis.json');

module.exports = {
  name: "emojilist",
  aliases: ["listadeemojis", "listemojis"],
  type: "Geral",
  description: `Mostra todos os emojis que o bot tem acesso!`,

  async execute(message, args, comando, client, prefix, connection) {
    const podeEnviarMsg = message.channel.memberPermissions(message.guild.me).has("SEND_MESSAGES")
    const podeAddReactions = message.channel.memberPermissions(message.guild.me).has("ADD_REACTIONS")
    if(!podeEnviarMsg) {
      if(podeAddReactions) message.react(emojis.alertcircleamarelo)
      return;
    }
    if(!podeAddReactions) {
      if(podeEnviarMsg) message.channel.send(`<:${emojis.alertcircleamarelo}> Eu preciso da permissão de \`adicionar reações\` para poder exibir os emojis!`)
      return;
    };
    const emojisArray = client.emojis.cache.filter(emoji => !emoji.animated).map(x => x.identifier) // Cria uma array com os identifiers de todos os emojis estáticos do bot
    let maior = 0;
    for(i = 0; i < emojisArray.length; i++) { // Faz um loop para salvar o maior identifier dentro do array
      if(emojisArray[i].length > maior) {
        maior = emojisArray[i].length
      }
    }
    const embed = new Discord.MessageEmbed()
      .setColor(hex.blue2)
      .setTitle(`Lista de emojis (1/${Math.ceil(emojisArray.length/(2000/maior))})`)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setDescription(`<:${emojisArray.slice(0, 2000/maior).join('> <:')}>`)
    const msg = await message.channel.send(embed)
    if(Math.ceil(emojisArray.length/(2000/maior)) > 1) {
      msg.react(emojis.fastforward)
    }
    const filter = (react, user) => react.emoji.identifier === emojis.fastforward || react.emoji.identifier === emojis.rewind && user.id === message.author.id
    const collector = msg.createReactionCollector(filter, { time: 300000 })
    collector.on('collect', (reaction, user) => {
      const page = Number(reaction.message.embeds[0].title.split('(')[1].split('/')[0])
      if(user.id === client.user.id || user.id !== message.author.id)return;
      if(!reaction.me)return;
      if(reaction.emoji.identifier === emojis.fastforward) {
        if(emojisArray.slice(2000/maior*page, 2000/maior*(page+1)).join('> <:').length === 0)return;
        const embedForward = new Discord.MessageEmbed()
          .setColor(hex.blue2)
          .setTitle(`Lista de emojis (${page+1}/${Math.ceil(emojisArray.length/(2000/maior))})`)
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`<:${emojisArray.slice(2000/maior*page, 2000/maior*(page+1)).join('> <:')}>`)
        msg.edit(embedForward)
        msg.react(emojis.rewind)
        if(page+1 === Math.ceil(emojisArray.length/(2000/maior))) msg.reactions.cache.find(react => react.emoji.identifier === emojis.fastforward).users.remove(client.user)
      }
      if(reaction.emoji.identifier === emojis.rewind) {
        if(emojisArray.slice(2000/maior*(page-2), 2000/maior*(page-1)).join('> <:').length === 0)return;
        const embedRewind = new Discord.MessageEmbed()
          .setColor(hex.blue2)
          .setTitle(`Lista de emojis (${page-1}/${Math.ceil(emojisArray.length/(2000/maior))})`)
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`<:${emojisArray.slice(2000/maior*(page-2), 2000/maior*(page-1)).join('> <:')}>`)
        msg.edit(embedRewind)
        msg.react(emojis.fastforward)
        if(page-1 === 1) msg.reactions.cache.find(react => react.emoji.identifier === emojis.rewind).users.remove(client.user)
      }
    })
  }
}