/* eslint-disable camelcase */
import { MessageEmbed } from 'discord.js'
import Channel from '../database/entities/Channel'
import Command from '../shared/Command'
import { x_, check, user_check, user_x } from '../utils/emojis.json'

export default new Command({
  name: 'controlcalculator',
  aliases: ['controlcalc', 'configcalculator', 'configcalc', 'cc'],
  category: 'configuration',
  description:
    'Com esse comando você pode escolher em qual(is) canal(is) o comando **calculator** deve funcionar, já que é um comando sem prefixo e pode em alguns casos atrapalhar uma conversa ou responder algo para o qual não foi chamado!',
  memberNecessaryPermissions: [['MANAGE_GUILD']],
  botNecessaryPermissions: [['ADD_REACTIONS', 'SEND_MESSAGES']],
  cooldown: {
    time: 10000,
    uses: 2,
  },
  run: async ({ message, bot }) => {
    const databaseChannel = bot.database.channels.cache.get(message.channel.id)

    if (!databaseChannel)
      bot.database.channels.cache.set(
        message.channelId,
        Channel.create({
          channel_id: message.channelId,
          guild_id: message.guildId!,
        })
      )

    const currentChannelAllowed = databaseChannel?.calc_allowed.value ?? true
    const databaseGuildChannels = bot.database.channels.cache.filter(
      (channel) => channel.guild_id.value === message.guild!.id
    )

    const embed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle(`Reaga com a ação que deseja realizar!`)
      .setTimestamp()
      .setDescription(
        `**${bot.emojis.cache.get(
          currentChannelAllowed ? user_x : user_check
        )} \`|\` ${
          currentChannelAllowed
            ? 'Desativar calculadora neste canal'
            : 'Ativar calculadora neste canal'
        }\n${bot.emojis.cache.get(
          check
        )} \`|\` Desativar a calculadora em todos os canais registrados do servidor\n${bot.emojis.cache.get(
          x_
        )} \`|\` Ativar a calculadora em todos os canais registrados do servidor**`
      )

    const msg = await message.channel.send({ embeds: [embed] })

    await msg.react(currentChannelAllowed ? user_x : user_check)
    await msg.react(check)
    await msg.react(x_)

    const collector = msg.createReactionCollector({
      max: 1,
      time: 20000,
      filter: (_reaction, user) => user.id === message.author.id,
    })

    collector.on('collect', async (reaction) => {
      if (
        reaction.emoji ===
        bot.emojis.cache.get(currentChannelAllowed ? user_x : user_check)!
      ) {
        const embedConclusao = new MessageEmbed()
          .setColor('#7289DA')
          .setTitle(
            `O comando **calculator** foi ${
              currentChannelAllowed ? 'desativado' : 'ativado'
            } neste canal!`
          )
          .setTimestamp()

        bot.database.channels.cache.set(
          message.channelId,
          Channel.restore({
            calc_allowed: !currentChannelAllowed,
            channel_id: message.channelId,
            guild_id: message.guildId!,
          })
        )

        msg.edit({ embeds: [embedConclusao] })
      } else if (reaction.emoji.id === check) {
        const embedConclusao = new MessageEmbed()
          .setColor('#7289DA')
          .setTitle(`O comando **calculator** foi ativado neste servidor!`)
          .setTimestamp()

        databaseGuildChannels.forEach((channel) => {
          bot.database.channels.cache.set(
            channel.channel_id.value,
            Channel.restore({
              calc_allowed: true,
              channel_id: channel.channel_id.value,
              guild_id: channel.guild_id.value,
            })
          )
        })

        msg.edit({ embeds: [embedConclusao] })
      } else if (reaction.emoji.id === x_) {
        const embedConclusao = new MessageEmbed()
          .setColor('#7289DA')
          .setTitle(`O comando **calculator** foi desativado neste servidor!`)
          .setTimestamp()

        databaseGuildChannels.forEach((channel) => {
          bot.database.channels.cache.set(
            channel.channel_id.value,
            Channel.restore({
              calc_allowed: false,
              channel_id: channel.channel_id.value,
              guild_id: channel.guild_id.value,
            })
          )
        })

        msg.edit({ embeds: [embedConclusao] })
      }
    })

    collector.on('end', (_coll, reason) => {
      if (reason === 'time') {
        const closedEmbed = new MessageEmbed()
          .setColor('#7289DA')
          .setTitle(`Tempo esgotado`)

        msg.edit({ embeds: [closedEmbed] }).catch(() => {})
      }
    })
  },
})
