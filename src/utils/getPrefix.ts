import { Bot } from '../shared/Bot'

export default async function getPrefix(
  guildId: string,
  bot: Bot<true>
): Promise<string | undefined> {
  return (await bot.database.guilds.fetch(guildId, bot))?.prefix.value
}
