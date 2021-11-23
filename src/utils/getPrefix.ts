import { Bot } from '../shared/Bot'

export default async function getPrefix(
  guildId: string,
  bot: Bot<true>
): Promise<string | undefined> {
  return bot.database.guilds.cache.get(guildId)?.prefix.value
}
