import chalk from 'chalk'
import { bot } from '..'
import setCommandsHandler from '../config/handlers/commands'
import { DatabaseTables } from '../database'
import Event from '../shared/Event'
import changeActivity from '../utils/changeActivity'
import log from '../utils/log'

export default new Event(
  'ready',
  async () => {
    log.info('INICIANDO...', {
      discord: {
        title: `Bot \`${bot.user?.username}\` iniciado em ${
          (bot.readyTimestamp! - bot.instanciedTime.getTime()) / 1000
        } segundos!`,
        emoji: 'onoff',
      },
    })

    const guilds = bot.guilds.cache

    log.info(chalk.bold('ESTATÍSTICAS'))
    log.info(`Usuários: ${chalk.yellow(bot.users.cache.size)}`)
    log.info(`Canais: ${chalk.yellow(bot.channels.cache.size)}`)
    log.info(`Servidores: ${chalk.yellow(guilds.size)}`)

    log.info(chalk.bold('10 MAIORES SERVIDORES'))

    const top10Guilds = guilds
      .sort((a, b) => b.memberCount - a.memberCount)
      .first(10)
    for (const guild in top10Guilds) {
      log.info(
        `[${chalk.cyan(`${Number(guild) + 1}`.padStart(2, '0'))}/${chalk.cyan(
          10
        )}] ${top10Guilds[guild]!.name} (${chalk.yellow(
          top10Guilds[guild]!.memberCount
        )})`
      )
    }

    changeActivity(bot)

    log.info('SINCRONIZANDO BANCO DE DADOS COM DISCORD...')

    const dataToSync: DatabaseTables[] = ['guilds', 'channels']

    dataToSync.forEach((name, index) => {
      const idx = `${index + 1}`.padStart(`${dataToSync.length}`.length, '0')

      bot.database![name].syncWithDiscord(bot)

      log.success(
        `[${chalk.green(idx)}/${chalk.greenBright(
          dataToSync.length
        )}] Dados de ${chalk.cyan(name)} sincronizados!`
      )
    })

    await setCommandsHandler(bot)
  },
  'once'
)
