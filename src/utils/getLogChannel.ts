import { TextChannel } from 'discord.js'
import { Bot } from '../shared/Bot'
import { env } from './env'

export default async function getLogChannel(bot: Bot): Promise<TextChannel> {
  return (await bot.channels.fetch(env.MAIN_LOG_CHANNEL)) as TextChannel
}
