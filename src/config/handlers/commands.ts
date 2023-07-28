import chalk from 'chalk'
import { readdirSync } from 'fs'
import { Bot } from '../../shared/Bot'
import { CommandClass } from '../../shared/Command'
import getFormatedDirname from '../../utils/getFormatedDirname'
import log from '../../utils/log'

export default async function setCommandsHandler(bot: Bot<true>) {
  log.info('SETANDO COMANDOS...')

  try {
    const commandFiles = readdirSync(
      getFormatedDirname(__dirname) + '../../commands'
    ).filter((file) => file.endsWith('.js'))

    for (const file of commandFiles) {
      const idx = `${commandFiles.indexOf(file) + 1}`

      try {
        const command = new (require(`../../commands/${file}`)
          ?.default as typeof CommandClass)()
        bot.commands.set(command.name, command)

        log.success(
          `[${chalk.green(
            idx.padStart(`${commandFiles.length}`.length, '0')
          )}/${chalk.greenBright(commandFiles.length)}] Comando ${chalk.cyan(
            file.slice(0, -3)
          )} setado!`
        )
      } catch (error: any) {
        log.error(`Erro ao setar o comando: ${file?.slice(0, -3)}!\nErro:`, {
          restLogs: [error],
        })
      }
    }

    bot.application.commands.set(
      bot.commands.toJSON().map((command) => ({
        name: command.name,
        description: command.type === 'CHAT_INPUT' && command.description,
        options: command.type === 'CHAT_INPUT' ? command.options : undefined,
        type: command.type as any,
      }))
    )
    ;['738578134336536598', '738578134336536598'].map((guildId) =>
      bot.guilds.cache.get(guildId)?.commands.set(
        bot.commands.toJSON().map((command) => ({
          name: command.name,
          description: command.type === 'CHAT_INPUT' && command.description,
          options: command.type === 'CHAT_INPUT' ? command.options : undefined,
          type: command.type as any,
        }))
      )
    )
  } catch (error: any) {
    log.error('Erro ao setar os comandos!\nErro:', { restLogs: [error] })
  }
}
