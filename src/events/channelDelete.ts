import { bot } from '..'
import Event from '../shared/Event'

export default new Event('channelDelete', (channel) => {
  bot.database?.channels.cache.delete(channel.id)
})
