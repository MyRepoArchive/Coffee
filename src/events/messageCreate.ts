import Event from '../shared/Event'
import calc from '../utils/calc'
import { env } from '../utils/env'
import getPrefix from '../utils/getPrefix'

export default new Event('messageCreate', async (bot, message) => {
  const isGuild = message.inGuild()
  const dbPrefix = isGuild && (await getPrefix(message.guildId!, bot))

  if (!dbPrefix && isGuild)
    bot.database.guilds.create({ guild_id: message.guildId! })

  const isMentionPrefix =
    message.content.startsWith(`<@${bot.user.id}>`) ||
    message.content.startsWith(`<@!${bot.user.id}>`)

  const prefix = isMentionPrefix
    ? message.content.slice(0, message.content.indexOf('>') + 1)
    : dbPrefix || env.PREFIX

  const args = message.content.slice(prefix.length).trim().split(/ +/g)

  const usedCommand = args.shift()?.toLowerCase() || ''

  if (message.content.startsWith(prefix)) {
    const command =
      bot.commands.get(usedCommand) ||
      bot.commands.find((command) => command.aliases.includes(usedCommand))

    command?.start({
      bot,
      message,
      isGuild,
      args,
      usedCommand,
      prefix,
      isMentionPrefix,
      dbPrefix,
    })
  } else {
    calc({ message, bot })
  }
})
