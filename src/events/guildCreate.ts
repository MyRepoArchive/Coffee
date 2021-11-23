import chalk from 'chalk'
import Event from '../shared/Event'
import Discord from 'discord.js'
import { bot } from '..'
import log from '../utils/log'
import Guild from '../database/entities/Guild'

export default new Event('guildCreate', async (guild) => {
  enterLogs(guild)

  bot.database?.guilds.cache.set(guild.id, Guild.create({ guild_id: guild.id }))
})

async function enterLogs(guild: Discord.Guild) {
  log.info(`Bot acabou de entrar no servidor ${chalk.cyan(guild.name)}!`, {
    discord: {
      emoji: 'in',
      title: `Bot acabou de entrar no servidor \`${guild.name}\`!`,
    },
  })
}
