import chalk from 'chalk'
import Event from '../shared/Event'
import getLogChannel from '../utils/getLogChannel'
import infoTemplate from '../utils/infoTemplate'
import { OkPacket } from 'mysql'
import errorTemplate from '../utils/errorTemplate'
import { Guild, MessageAttachment } from 'discord.js'
import successTemplate from '../utils/successTemplate'
import { Bot } from '../shared/Bot'
import { env } from '../utils/env'
import GuildDeleteError from '../database/controllers/GuildsController/errors/GuildDeleteError'
import { bot } from '..'
import log from '../utils/log'

export default new Event('guildDelete', async (guild) => {
  if (guild.id === '901538946222293002' || guild.id === '901750805948932126')
    return

  leaveLogs(bot, guild)

  bot
    .database!.guilds.delete(guild.id)
    .then(() => onRemoveSuccess(guild, bot))
    .catch((error: GuildDeleteError) => {
      if (error.reason === 'Error')
        onRemoveError(error.mysqlError!, guild, error.query, bot)
      else if (error.reason === 'Mais de uma linha afetada')
        onRemoveMoreOfOneRow(guild, bot, error.query, error.results!)
      else onRemoveNoneRows(guild, bot, error.query, error.results!)
    })
})

async function leaveLogs(bot: Bot, guild: Guild) {
  log.info(`Bot acabou de sair do servidor ${chalk.cyan(guild.name)}!`)

  const logChannel = await getLogChannel(bot)

  logChannel?.send({
    embeds: [
      {
        color: '#00FFFF',
        title: `<:out:906245908478455808>  Bot acabou de sair do servidor \`${guild.name}\`!`,
        timestamp: new Date(),
      },
    ],
  })
}

async function onRemoveError(
  error: Error,
  guild: Guild,
  query: string,
  bot: Bot
) {
  log.error(
    `Erro ao remover o registro do servidor ${chalk.white(
      guild.name
    )} do banco de dados!\nQuery: ${query}\nErro:`,
    error
  )

  const logChannel = await getLogChannel(bot)
  const errorText = new MessageAttachment(
    Buffer.from(error.stack || error.message),
    'error.txt'
  )
  const errorJson = new MessageAttachment(
    Buffer.from(JSON.stringify(error, null, 2)),
    'error.json'
  )

  await logChannel?.send({
    content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
    embeds: [
      {
        color: '#FC2A2A',
        footer: {
          text: __filename,
        },
        timestamp: new Date(),
        title: `<:x_:905962263750537257>  Erro ao remover o registro do servidor \`${guild.name}\` do banco de dados!`,
        description: `\`\`\`${query}\`\`\``,
      },
    ],
  })
  await logChannel?.send({ files: [errorText, errorJson] })
}

async function onRemoveSuccess(guild: Guild, bot: Bot) {
  log.success(
    `Registro do servidor ${chalk.cyan(guild.name)} (${chalk.cyan(
      guild.id
    )}) removido com sucesso do banco de dados!`
  )

  const logChannel = await getLogChannel(bot)

  logChannel?.send({
    embeds: [
      {
        color: '#00FF75',
        title: `<:check:905952950864715836>  Registro do servidor \`${guild.name}\` (\`${guild.id}\`) removido com sucesso do banco de dados!`,
        timestamp: new Date(),
      },
    ],
  })
}

async function onRemoveMoreOfOneRow(
  guild: Guild,
  bot: Bot,
  query: string,
  results: OkPacket
) {
  log.error(
    `Mais de um registro foi afetado ao tentar remover o registro do servidor ${chalk.white(
      guild.name
    )} do banco de dados!\nQuery: ${query}\nOkPacket:`,
    JSON.stringify(results, null, 2)
  )

  const logChannel = await getLogChannel(bot)
  const error = new MessageAttachment(
    Buffer.from(JSON.stringify(results, null, 2)),
    'ok_packet.json'
  )

  await logChannel?.send({
    content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
    embeds: [
      {
        color: '#FC2A2A',
        footer: {
          text: __filename,
        },
        timestamp: new Date(),
        title: `<:x_:905962263750537257>  Mais de um registro foi afetado ao tentar remover o registro do servidor \`${guild.name}\` do banco de dados!`,
        description: `\`\`\`${query}\`\`\``,
      },
    ],
  })
  logChannel?.send({ files: [error] })
}

async function onRemoveNoneRows(
  guild: Guild,
  bot: Bot,
  query: string,
  results: OkPacket
) {
  log.error(
    `Nenhum registro foi afetado ao tentar remover o registro do servidor ${chalk.white(
      guild.name
    )} do banco de dados!\nQuery: ${query}\nOkPacket:`,
    JSON.stringify(results, null, 2)
  )

  const logChannel = await getLogChannel(bot)
  const error = new MessageAttachment(
    Buffer.from(JSON.stringify(results, null, 2)),
    'ok_packet.json'
  )

  await logChannel?.send({
    content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
    embeds: [
      {
        color: '#FC2A2A',
        footer: {
          text: __filename,
        },
        timestamp: new Date(),
        title: `<:x_:905962263750537257>  Nenhum registro foi afetado ao tentar remover o registro do servidor \`${guild.name}\` do banco de dados!`,
        description: `\`\`\`${query}\`\`\``,
      },
    ],
  })
  logChannel?.send({ files: [error] })
}
