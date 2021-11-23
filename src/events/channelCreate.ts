import { bot } from '..'
import Channel from '../database/entities/Channel'
import Event from '../shared/Event'

export default new Event('channelCreate', (channel) => {
  bot.database?.channels.cache.set(
    channel.id,
    Channel.create({ guild_id: channel.guild.id, channel_id: channel.id })
  )
})
