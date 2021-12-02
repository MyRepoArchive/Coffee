import Command from '../shared/Command'
import osu from 'node-os-utils'
import dayjs from 'dayjs'
import { MessageEmbed } from 'discord.js'
import { x_ } from '../utils/emojis.json'

export default new Command({
  name: 'botinfo',
  aliases: ['bi'],
  description:
    'Exibe algumas informações do bot, como número de comandos, de usuários, de canais, servidores...',
  run: async ({ message, bot, dbPrefix }) => {
    const comandos = bot.commands.map((comando) => comando.name)
    const cpu = await osu.cpu.usage()
    const criacao = dayjs(bot.user.createdTimestamp).format('LLLL')
    const entrou = dayjs(message.guild!.me!.joinedAt).format('LLLL')

    const embedInfo = new MessageEmbed()
      .setColor('#7289DA')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle('Informações sobre mim')
      .setDescription(
        `Username: **${bot.user.username}**\nApelido: **${
          message.guild!.me!.nickname === null
            ? 'Não tenho apelido nesse servidor'
            : message.guild!.me!.nickname
        }**\nID: **${bot.user.id}**\nTag: **${bot.user.tag}**`
      )
      .addFields(
        // Corpo da embed com o conteúdo importante
        {
          name: 'Estatísticas Discord',
          value: `Servidores(**${bot.guilds.cache.size}**)  Usuários(**${bot.users.cache.size}**)  Canais(**${bot.channels.cache.size}**)  Emojis(**${bot.emojis.cache.size}**)`,
          inline: true,
        },
        {
          name: 'Interação',
          value: `Comandos(**${comandos.length}**)  Prefixo: "\`${dbPrefix}\`"`,
          inline: true,
        },
        {
          name: 'Tecnologias utlizadas',
          value: '**JavaScript**  **NodeJS**  **MySQL** **TypeScript**',
          inline: true,
        },
        {
          name: 'Links',
          value: `[Me-adicione](https://discordapp.com/oauth2/authorize?=&client_id=${bot.user.id}&scope=bot)`,
          inline: true,
        },
        {
          name: `Datas`,
          value: `Criação: **${criacao}** (${parseInt(
            (Date.now() - bot.user.createdTimestamp) / 31536000000 + ''
          )} anos, ${parseInt(
            ((Date.now() - bot.user.createdTimestamp) % 31536000000) /
              2628000000 +
              ''
          )} meses e ${parseInt(
            (((Date.now() - bot.user.createdTimestamp) % 31536000000) %
              2628000000) /
              86400000 +
              ''
          )} dias)\nEntrei aqui: **${entrou}** (${parseInt(
            (Date.now() - message.guild!.me!.joinedTimestamp!) / 31536000000 +
              ''
          )} anos, ${parseInt(
            ((Date.now() - message.guild!.me!.joinedTimestamp!) % 31536000000) /
              2628000000 +
              ''
          )} meses e ${parseInt(
            (((Date.now() - message.guild!.me!.joinedTimestamp!) %
              31536000000) %
              2628000000) /
              86400000 +
              ''
          )} dias)`,
          inline: true,
        },
        {
          name: `Estatísticas`,
          value: `Ping(**${Math.round(bot.ws.ping)}ms**)  Uptime: **${parseInt(
            bot.uptime / 3600000 + ''
          )}h e ${parseInt(
            (bot.uptime % 3600000) / 60000 + ''
          )}min**  Uso de CPU(**${cpu}%**)  Memória utilizada(**${parseInt(
            process.memoryUsage().rss / 1024 / 1024 + ''
          )}Mb**)`,
        }
      )
      .setTimestamp()
      .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))

    message.channel.send({ embeds: [embedInfo] }).catch(() => {
      message.author.send({ embeds: [embedInfo] })
      message.react(x_)
    })
  },
})
