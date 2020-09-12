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
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    if(!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js')
    const { pad } = require('../utils/pad.js')
    if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 10000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((10000-parseInt(Date.now() - this.cooldown[message.author.id].timestamp))/1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 10000){
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }
    const member = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => args.length === 0 ? member.id === message.member.id : member.user.tag.toLowerCase().includes(args.join(' ').toLowerCase())) || message.guild.members.cache.find(member => args.length === 0 ? member.id === message.member.id : member.displayName.toLowerCase().includes(args.join(' ').toLowerCase())) || message.member
    if(member.user.bot)return run(message, client, `<:${emojis.xcirclered}> Bots não recebem pontos, logo não possuem um score nem level!`, emojis.xcirclered)
    const podeAddReactions = message.channel.memberPermissions(message.guild.me).has("ADD_REACTIONS")
    if(podeAddReactions) await message.react(emojis.carregando)
    const getScore = await require('../utils/getScore.js').getScore(connection, message, member)
    if(getScore === 'erro') {
      run(message, client, `<:${emojis.dateclock}> ${member.displayName} ainda não tem pontuação no servidor!`, emojis.xcirclered)
      if(podeAddReactions) message.reactions.cache.find(react => react.emoji.identifier === emojis.carregando).users.remove(client.user.id)
      return 
    }
    const score = pad(getScore.scoreInServer, 3)
    const level = pad(getScore.level, 2);
    const globalLevel = pad(getScore.globalLevel, 2)
    const position = getScore.positionInServer
    let scoreImg;
    await loadImage('./image/profile-v4-1.png').then(async image => {
      const perfil = await loadImage(member.user.displayAvatarURL({ size: 1024, format: 'png' }))
      ctx.drawImage(perfil, 75, 130, 210, 210)
      ctx.drawImage(image, 0, 0, 1024, 400)
    
      ctx.font = '40px "Arvo"'
      ctx.textAlign = 'right'
      ctx.fillStyle = '#eef2f9'
      ctx.fillText(score, 619, 172, 276)
      ctx.textAlign = 'left'
      ctx.fillText(pad((2**level)*10, 3), 655, 172, 286)
      ctx.font = '80px "Arvo"'
      ctx.fillText(level, 381, 322, 120)
      ctx.fillText(globalLevel, 579, 322, 120)
      ctx.font = '130px "Arvo"'
      ctx.fillText(position+'º', 785, 310, 143)
      ctx.font = '900 30px "Arvo"'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#eef2f9'
      ctx.fillText(member.user.tag, 512, 95, 856)
    
      scoreImg = new Discord.MessageAttachment(canvas.toBuffer(), 'score.png')
    })
    run(message, client, scoreImg, emojis.alertcircleamarelo)
    if(podeAddReactions) message.reactions.cache.find(react => react.emoji.identifier === emojis.carregando).users.remove(client.user.id)
  }
}