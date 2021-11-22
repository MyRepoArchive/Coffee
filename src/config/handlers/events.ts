import chalk from 'chalk'
import { readdirSync } from 'fs'
import { Bot } from '../../shared/Bot'
import Event from '../../shared/Event'
import getFormatedDirname from '../../utils/getFormatedDirname'
import log from '../../utils/log'

export default async function setEventsHandler(bot: Bot<false>) {
  log.info(chalk.bold('SETANDO EVENTOS...'))

  try {
    const eventFiles = readdirSync(
      getFormatedDirname(__dirname) + '../../events'
    ).filter((file) => file.endsWith('.js'))

    for (const file of eventFiles) {
      const idx = `${eventFiles.indexOf(file) + 1}`

      try {
        const event = require(`../../events/${file}`)?.default as Event
        bot[event.type](event.name, (...params) => event.run(...params))

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
      }
    }
  } catch (error: any) {
    log.error('Erro ao setar os eventos!\nErro:', error)
  }
}
