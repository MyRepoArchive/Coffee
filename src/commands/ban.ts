import { MessageEmbed, ReactionCollectorOptions } from 'discord.js'
import Command from '../shared/Command'
import { x_, check } from '../../emojis.json'

export default new Command({
  name: 'ban',
  aliases: ['banir'],
  type: 'moderation',
  description: `Bane o usuário mencionado do servidor!`,
  botNecessaryPermissions: [['BAN_MEMBERS']],
  memberNecessaryPermissions: [['BAN_MEMBERS']],
  run: async ({ message, args, prefix, bot, isMentionPrefix }) => {
    const membro =
      (isMentionPrefix
        ? message.mentions.members?.at(1)
        : message.mentions.members?.first()) ||
      message.guild!.members.cache.get(args[0]) ||
      message.guild!.members.cache.find(
        (member) =>
          member.user.username.toLowerCase() === args.join(' ').toLowerCase() ||
          member.displayName.toLowerCase() === args.join(' ').toLowerCase()
      )
    if (!membro) {
      const descEmbed = new MessageEmbed()
        .setColor('#7289DA')
        .setTitle('Como usar o comando `ban`')
        .setDescription(
          `Modo de usar:\n**Mencionando o usuário:** *${prefix}ban \`@member\`*\n**Pelo ID:** *${prefix}ban \`ID\`*\n**Pelo username ou apelido:** *${prefix}ban \`username\`*`
        )
        .setTimestamp()
      return message.channel.send({ embeds: [descEmbed] }).catch(() => {
        message.author.send({ embeds: [descEmbed] })
        message.react(x_)
      })
    }
    if (membro.user.id === bot.user.id) {
      const messageContent = `> <:x_:${x_}> Não posso me banir!`
      return message.channel.send(messageContent).catch(() => {
        message.author.send(messageContent)
        message.react(x_)
      })
    }
    if (membro === message.member) {
      const messageContent = `> <:x_:${x_}> Não pode banir a si mesmo!`
      return message.channel.send(messageContent).catch(() => {
        message.author.send(messageContent)
        message.react(x_)
      })
    }
    if (membro.user.id === message.guild!.ownerId) {
      const messageContent = `> <:x_:${x_}> O dono do servidor não pode ser banido!`
      return message.channel.send(messageContent).catch(() => {
        message.author.send(messageContent)
        message.react(x_)
      })
    }
    if (
      membro.roles.highest.position >= message.guild!.me!.roles.highest.position
    ) {
      const messageContent = `> <:x_:${x_}> Usuário com cargo maior que o meu!`
      return message.channel.send(messageContent).catch(() => {
        message.author.send(messageContent)
        message.react(x_)
      })
    }
    if (
      membro.roles.highest.position >= message.member!.roles.highest.position &&
      message.author.id !== message.guild!.ownerId
    ) {
      const messageContent = `> <:x_:${x_}> Usuário com cargo maior que o seu!`
      return message.channel.send(messageContent).catch(() => {
        message.author.send(messageContent)
        message.react(x_)
      })
    }

    const msgMotivo = await message.channel.send(
      'Deseja adiciona um motivo ao banimento?'
    )
    await msgMotivo.react(x_)
    await msgMotivo.react(check)

    const collectorOptions: ReactionCollectorOptions = {
      filter: (reaction, user) => reaction.me && user.id === message.author.id,
      max: 1,
      time: 60000,
    }

    const collectorReactionMotivo =
      msgMotivo.createReactionCollector(collectorOptions)

    collectorReactionMotivo.on('collect', (reaction) => {
      async function daysAndBan(motivo = '') {
        msgMotivo.edit(
          `Selecione a quantidade de dias para que as mensagens de **${
            membro!.user.tag
          }** sejam deletadas!`
        )
        await msgMotivo.reactions.cache.get(check)?.users.remove(bot.user.id)

        await msgMotivo.react('0️⃣')
        await msgMotivo.react('1️⃣')
        await msgMotivo.react('2️⃣')
        await msgMotivo.react('3️⃣')
        await msgMotivo.react('4️⃣')
        await msgMotivo.react('5️⃣')
        await msgMotivo.react('6️⃣')
        await msgMotivo.react('7️⃣')
        await msgMotivo.react(x_)

        const collectorDias =
          msgMotivo.createReactionCollector(collectorOptions)

        collectorDias.on('collect', (reaction) => {
          if (reaction.emoji.name === '0️⃣')
            membro!.ban({ days: 0, reason: motivo })
          if (reaction.emoji.name === '1️⃣')
            membro!.ban({ days: 1, reason: motivo })
          if (reaction.emoji.name === '2️⃣')
            membro!.ban({ days: 2, reason: motivo })
          if (reaction.emoji.name === '3️⃣')
            membro!.ban({ days: 3, reason: motivo })
          if (reaction.emoji.name === '4️⃣')
            membro!.ban({ days: 4, reason: motivo })
          if (reaction.emoji.name === '5️⃣')
            membro!.ban({ days: 5, reason: motivo })
          if (reaction.emoji.name === '6️⃣')
            membro!.ban({ days: 6, reason: motivo })
          if (reaction.emoji.name === '7️⃣')
            membro!.ban({ days: 7, reason: motivo })

          if (reaction.emoji.id === x_) {
            return msgMotivo.edit('Banimento cancelado!')
          }

          msgMotivo.edit(`**${membro!.user.tag}** foi banido com sucesso!`)
        })

        collectorDias.on('end', (_coll, reason) => {
          if (reason === 'time') msgMotivo.edit('Banimento cancelado!')
        })
      }

      if (reaction.emoji.id === x_) {
        daysAndBan()
      } else if (reaction.emoji.id === check) {
        msgMotivo.edit(`Digite abaixo o motivo do banimento!`)

        const collector = message.channel.createMessageCollector({
          filter: (msg) => msg.author.id === message.author.id,
          time: 20000,
          max: 1,
        })
        collector.on('collect', (msg) => {
          daysAndBan(msg.content)
        })
      }
    })

    collectorReactionMotivo.on('end', (_coll, reason) => {
      if (reason === 'time') msgMotivo.edit('Banimento cancelado!')
    })
    message.delete()
  },
})
