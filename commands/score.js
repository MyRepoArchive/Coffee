const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');
const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont('arvo.ttf', { family: "Arvo" })
const canvas = createCanvas(1024, 400)
const ctx = canvas.getContext('2d')
const fs = require('fs')

module.exports = {
  name: "score",
  name2: "pontuation",
  name3: "pontuação",
  name4: "pontos",
  name5: "level",
  type: "Geral",
  description: "Veja seus pontos e em qual level você está!",

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js')
    const { pad } = require('../utils/pad.js')
    const member = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username === args.join(' ')) || message.guild.members.cache.find(member => member.nickname === args.join(' ')) || message.guild.members.cache.get(args[0]) || message.member
    if(member.user.bot)return run(message, client, `<:${emojis.xcirclered}> Bots não recebem pontos, logo não possuem um score nem level!`, emojis.xcirclered)
    const podeAddReactions = message.channel.memberPermissions(message.guild.me).has("ADD_REACTIONS")
    if(podeAddReactions) await message.react(emojis.carregando)
    const score = pad(await require('../utils/getScore.js').getScore(connection, message, member), 3)
    const level = pad(await require('../utils/getScore.js').getLevel(connection, message, member), 2);
    const globalLevel = pad(await require('../utils/getScore.js').getGlobalLevel(connection, member, message), 2)
    let scoreImg;
    await loadImage('./image/profile-v3.png').then(async image => {
      const perfil = await loadImage(member.user.displayAvatarURL({ size: 1024, format: 'png' }))
      ctx.drawImage(perfil, 75, 75, 250, 250)
      ctx.drawImage(image, 0, 0, 1024, 400)
    
      ctx.font = '20px "Arvo"'
      ctx.textAlign = 'right'
      ctx.fillStyle = '#eef2f9'
      ctx.fillText(score+9000000, 618, 165, 270)
      ctx.fillStyle = '#eef2f9'
      ctx.font = '15px "Arvo"'
      ctx.fillText(level, 250, 152)
      ctx.fillText(globalLevel, 400, 152)
      ctx.font = '900 25px Arial'
      ctx.fillStyle = '#eef2f9'
      ctx.fillText(member.user.tag.length > 20 ? member.user.tag.slice(0, 20)+'...' : member.user.tag, 344, 105)
    
      scoreImg = new Discord.MessageAttachment(canvas.toBuffer(), 'score.png')
    })
    run(message, client, scoreImg, emojis.alertcircleamarelo)
    if(podeAddReactions) message.reactions.cache.find(react => react.emoji.identifier === emojis.carregando).users.remove(client.user.id)
  }
}