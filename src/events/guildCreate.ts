import chalk from 'chalk'
import Event from '../shared/Event'
import getLogChannel from '../utils/getLogChannel'
import infoTemplate from '../utils/infoTemplate'
import { MysqlError, OkPacket } from 'mysql'
import errorTemplate from '../utils/errorTemplate'
import { Guild, MessageAttachment } from 'discord.js'
import successTemplate from '../utils/successTemplate'
import { Bot } from '../shared/Bot'
import { env } from '../utils/env'
import GuildCreateError from '../database/controllers/GuildsController/errors/GuildCreateError'

export default new Event('guildCreate', async (bot, guild) => {
  enterLogs(bot, guild)

  bot.database?.guilds
    .create({ guild_id: guild.id })
    .then(() => onCreateSuccess(bot, guild))
    .catch((error: GuildCreateError) => {
      if (error.reason === 'Error')
        onCreateError(error.mysqlError!, bot, guild, error.query)
      else if (error.reason === 'Mais de uma linha afetada')
        onAffectMoreOfOneRow(guild, bot, error.query, error.results!)
      else onAffectNoneRows(guild, bot, error.query, error.results!)
    })
})

async function enterLogs(bot: Bot, guild: Guild) {
  console.info(
    '\n' + infoTemplate(),
    `Bot acabou de entrar no servidor ${chalk.cyan(guild.name)}!`
  )

  const logChannel = await getLogChannel(bot)

  logChannel?.send({
    embeds: [
      {
        color: '#00FFFF',
        title: `<:in:906163628753944608>  Bot acabou de entrar no servidor \`${guild.name}\`!`,
        timestamp: new Date(),
      },
    ],
  })
}

async function onCreateError(
  error: MysqlError,
  bot: Bot,
  guild: Guild,
  query: string
) {
  console.error(
    errorTemplate(),
    chalk.bold.red(
      `Erro ao cadastrar o servidor ${chalk.white(
        guild.name
      )} no banco de dados!\nQuery: ${query}\nErro:`,
      error
    )
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
        title: `<:x_:905962263750537257>  Erro ao cadastrar o servidor \`${guild.name}\` no banco de dados!`,
        description: `\`\`\`${query}\`\`\``,
      },
    ],
  })
  await logChannel?.send({ files: [errorText, errorJson] })
}

async function onAffectMoreOfOneRow(
  guild: Guild,
  bot: Bot,
  query: string,
  results: OkPacket
) {
  console.error(
    errorTemplate(),
    chalk.bold.red(
      `Mais de um registro foi afetado ao tentar registrar o servidor ${chalk.white(
        guild.name
      )} no banco de dados!\nQuery: ${query}\nOkPacket:`,
      JSON.stringify(results, null, 2)
    )
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
        title: `<:x_:905962263750537257>  Mais de um registro foi afetado ao tentar registrar o servidor \`${guild.name}\` no banco de dados!`,
        description: `\`\`\`${query}\`\`\``,
      },
    ],
  })
  logChannel?.send({ files: [error] })
}

async function onAffectNoneRows(
  guild: Guild,
  bot: Bot,
  query: string,
  results: OkPacket
) {
  console.error(
    errorTemplate(),
    chalk.bold.red(
      `Nenhum registro foi afetado ao tentar registrar o servidor ${chalk.white(
        guild.name
      )} no banco de dados!\nQuery: ${query}\nOkPacket:`,
      JSON.stringify(results, null, 2)
    )
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
        title: `<:x_:905962263750537257>  Nenhum registro foi afetado ao tentar registrar o servidor \`${guild.name}\` no banco de dados!`,
        description: `\`\`\`${query}\`\`\``,
      },
    ],
  })
  logChannel?.send({ files: [error] })
}

async function onCreateSuccess(bot: Bot, guild: Guild) {
  console.info(
    successTemplate(),
    `Servidor ${chalk.cyan(guild.name)} (${chalk.cyan(
      guild.id
    )}) cadastrado com sucesso no banco de dados!`
  )

  const logChannel = await getLogChannel(bot)

  logChannel?.send({
    embeds: [
      {
        color: '#00FF75',
        title: `<:check:905952950864715836>  Servidor \`${guild.name}\` (\`${guild.id}\`) cadastrado com sucesso no banco de dados!`,
        timestamp: new Date(),
      },
    ],
  })
}
