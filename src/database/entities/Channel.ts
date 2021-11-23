/* eslint-disable camelcase */
import { CalcAllowed } from '../objectValues/CalcAllowed'
import { DiscordID } from '../objectValues/DiscordID'

export interface ChannelDTO {
  guild_id: string
  channel_id: string
  calc_allowed?: boolean
}

export interface ChannelObject {
  guild_id: string
  channel_id: string
  calc_allowed: boolean
}

export interface DatabaseChannel extends Omit<ChannelObject, 'calc_allowed'> {
  calc_allowed: `${boolean}`
}

export default class Channel {
  private constructor(
    public readonly guild_id: DiscordID,
    public readonly channel_id: DiscordID,
    public readonly calc_allowed: CalcAllowed
  ) {}

  get value(): ChannelObject {
    return {
      guild_id: this.guild_id.value,
      channel_id: this.channel_id.value,
      calc_allowed: this.calc_allowed.value,
    }
  }

  get dbValue(): DatabaseChannel {
    return {
      guild_id: this.guild_id.value,
      channel_id: this.channel_id.value,
      calc_allowed: `${this.calc_allowed.value}`,
    }
  }

  static create(channel: ChannelDTO): Channel {
    const channel_id = DiscordID.create(channel.channel_id, 'channel_id')
    const guild_id = DiscordID.create(channel.guild_id, 'guild_id')
    const calc_allowed = CalcAllowed.create(
      channel.calc_allowed ?? true,
      'calc_allowed'
    )

    return new Channel(guild_id, channel_id, calc_allowed)
  }

  static restore(channel: ChannelObject): Channel {
    const channel_id = DiscordID.create(channel.channel_id, 'channel_id')
    const guild_id = DiscordID.create(channel.guild_id, 'guild_id')
    const calc_allowed = CalcAllowed.create(
      channel.calc_allowed,
      'calc_allowed'
    )

    return new Channel(guild_id, channel_id, calc_allowed)
  }
}
