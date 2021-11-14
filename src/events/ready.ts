import chalk from 'chalk'
import Event from '../shared/Event'
import infoTemplate from '../utils/infoTemplate'
import changeActivity from '../utils/changeActivity'
import getLogChannel from '../utils/getLogChannel'
import successTemplate from '../utils/successTemplate'
import log from '../utils/log'

export default new Event(
  'ready',
  async (bot) => {
    log.info(chalk.bold('INICIANDO...'))

    const guilds = bot.guilds.cache
    const logChannel = await getLogChannel(bot)

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

    logChannel?.send({
      embeds: [
        {
          color: '#00ffff',
          title: `<:onoff:905961889081741382>  Bot \`${
            bot.user?.username
          }\` iniciado em ${
            (bot.readyTimestamp! - bot.instanciedTime.getTime()) / 1000
          } segundos!`,
          timestamp: new Date(),
        },
      ],
    })
    changeActivity(bot)

    log.info(chalk.bold('SINCRONIZANDO BANCO DE DADOS COM DISCORD...'))

    const dataToSync = [
      { name: 'guilds', promise: bot.database.guilds.syncWithDiscord(bot) },
    ]

    dataToSync.forEach(({ name, promise }, index) => {
      const idx = `${index + 1}`.padStart(`${dataToSync.length}`.length, '0')

      promise
        .then(() => {
          log.success(
            `[${chalk.green(idx)}/${chalk.greenBright(
              dataToSync.length
            )}] Dados de ${chalk.cyan(name)} sincronizados!`
          )
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {})
    })
  },
  'once'
)
