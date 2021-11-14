/* eslint-disable camelcase */
import { env } from '../../utils/env'
import { DiscordID } from '../objectValues/DiscordID'
import { Prefix } from '../objectValues/Prefix'

export interface GuildDTO {
  guild_id: string
  prefix?: string
}

export interface GuildObject {
  guild_id: string
  prefix: string
}

export default class Guild {
  private constructor(
    public readonly guild_id: DiscordID,
    public readonly prefix: Prefix
  ) {}

  get value(): GuildObject {
    return {
      guild_id: this.guild_id.value,
      prefix: this.prefix.value,
    }
  }

  static create(guild: GuildDTO): Guild {
    const guild_id = DiscordID.create(guild.guild_id, 'guild_id')
    const prefix = Prefix.create(guild.prefix ?? env.PREFIX)

    return new Guild(guild_id, prefix)
  }

  static restore(guild: GuildObject): Guild {
    const guild_id = DiscordID.create(guild.guild_id, 'guild_id')
    const prefix = Prefix.create(guild.prefix)

    return new Guild(guild_id, prefix)
  }
}
