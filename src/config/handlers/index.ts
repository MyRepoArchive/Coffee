import { Client } from 'discord.js'
import { Bot } from '../../shared/Bot'
import setCommandsHandler from './commands'
import setEventsHandler from './events'

export default async function setHandlers(bot: Bot) {
  await setEventsHandler(bot)
  await setCommandsHandler(bot)
  bot.emit('ready', bot as Client)
}
