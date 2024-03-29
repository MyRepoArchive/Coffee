import chalk from 'chalk'
import { readdirSync } from 'fs'
import { Bot } from '../../shared/Bot'
import getFormatedDirname from '../../utils/getFormatedDirname'
import log from '../../utils/log'

export default async function setCommandsHandler(bot: Bot<false>) {
  log.info('SETANDO COMANDOS...')

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
        log.error(`Erro ao setar o comando: ${file?.slice(0, -3)}!\nErro:`, {
          restLogs: [error],
        })
      }
    }
  } catch (error: any) {
    log.error('Erro ao setar os comandos!\nErro:', { restLogs: [error] })
  }
}
