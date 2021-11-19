import chalk from 'chalk'
import { MessageAttachment } from 'discord.js'
import { readdirSync } from 'fs'
import { Bot } from '../../shared/Bot'
import Event from '../../shared/Event'
import { env } from '../../utils/env'
import getFormatedDirname from '../../utils/getFormatedDirname'
import getLogChannel from '../../utils/getLogChannel'
import log from '../../utils/log'

export default async function setEventsHandler(bot: Bot<true>) {
  log.info(chalk.bold('SETANDO EVENTOS...'))

  try {
    const eventFiles = readdirSync(
      getFormatedDirname(__dirname) + '../../events'
    ).filter((file) => file.endsWith('.js'))

    for (const file of eventFiles) {
      const idx = `${eventFiles.indexOf(file) + 1}`

      try {
        const event = require(`../../events/${file}`)?.default as Event
        bot[event.type](event.name, (...params) => event.run(bot, ...params))

        log.success(
          `[${chalk.green(
            idx.padStart(`${eventFiles.length}`.length, '0')
          )}/${chalk.greenBright(eventFiles.length)}] Evento ${chalk.cyan(
            file.slice(0, -3)
          )} setado!`
        )
      } catch (error: any) {
        log.error(
          `Erro ao setar o evento: ${file?.slice(0, -3)}!\nErro:`,
          error
        )

        const logChannel = await getLogChannel(bot)
        const attachment = new MessageAttachment(
          Buffer.from(error.stack || error),
          'error.txt'
        )
        logChannel?.send({
          content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
          embeds: [
            {
              color: '#FC2A2A',
              title: `<:x_:905962263750537257>  Erro ao setar o evento: **${file?.slice(
                0,
                -3
              )}**!`,

              footer: {
                text: __filename,
              },
              timestamp: Date.now(),
            },
          ],
        })
        logChannel?.send({ files: [attachment] })
      }
    }
  } catch (error: any) {
    log.error('Erro ao setar os eventos!\nErro:', error)

    const logChannel = await getLogChannel(bot)
    const attachment = new MessageAttachment(
      Buffer.from(error.stack || error),
      'error.txt'
    )

    logChannel?.send({
      content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
      embeds: [
        {
          color: '#FC2A2A',
          title: `<:x_:905962263750537257>  Erro ao setar os eventos!`,

          footer: {
            text: __filename,
          },
          timestamp: Date.now(),
        },
      ],
    })
    logChannel?.send({ files: [attachment] })
  }
}
