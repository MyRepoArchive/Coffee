import chalk from 'chalk'
import Event from '../shared/Event'
import { Guild } from 'discord.js'
import { Bot } from '../shared/Bot'
import { bot } from '..'
import log from '../utils/log'

export default new Event('guildDelete', async (guild) => {
  if (guild.id === '901538946222293002' || guild.id === '901750805948932126')
    return

  leaveLogs(bot, guild)

  bot.database?.guilds.cache.delete(guild.id)
})

async function leaveLogs(bot: Bot, guild: Guild) {
  log.info(`Bot acabou de sair do servidor ${chalk.cyan(guild.name)}!`, {
    discord: {
      emoji: 'out',
      title: `Bot acabou de sair do servidor \`${guild.name}\`!`,
    },
  })
}
