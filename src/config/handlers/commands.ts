import chalk from 'chalk'
import { MessageAttachment } from 'discord.js'
import { readdirSync } from 'fs'
import { Bot } from '../../shared/Bot'
import { env } from '../../utils/env'
import getFormatedDirname from '../../utils/getFormatedDirname'
import getLogChannel from '../../utils/getLogChannel'
import log from '../../utils/log'

export default async function setCommandsHandler(bot: Bot<true>) {
  log.info(chalk.bold('SETANDO COMANDOS...'))

  try {
    const commandFiles = readdirSync(
      getFormatedDirname(__dirname) + '../../commands'
    ).filter((file) => file.endsWith('.js'))

    for (const file of commandFiles) {
      const idx = `${commandFiles.indexOf(file) + 1}`

      try {
        const command = require(`../../commands/${file}`)?.default
        bot.commands.set(command.name, command)

        log.success(
          `[${chalk.green(
            idx.padStart(`${commandFiles.length}`.length, '0')
          )}/${chalk.greenBright(commandFiles.length)}] Comando ${chalk.cyan(
            file.slice(0, -3)
          )} setado!`
        )
      } catch (error: any) {
        log.error(
          `Erro ao setar o comando: ${file?.slice(0, -3)}!\nErro:`,
          error
        )

        const logChannel = await getLogChannel(bot)
        const attachment = new MessageAttachment(
          Buffer.from(error.stack || error),
          'error.txt'
        )
        logChannel.send({
          content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
          embeds: [
            {
              color: '#FC2A2A',
              title: `<:x_:905962263750537257>  Erro ao setar o comando: **${file?.slice(
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
    log.error('Erro ao setar os comandos!\nErro:', error)

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
          title: `<:x_:905962263750537257>  Erro ao setar os comandos!`,
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
