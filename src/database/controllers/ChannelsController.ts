import Collection from '@discordjs/collection'
import { GuildChannel } from 'discord.js'
import { env } from '../../utils/env'
import Channel, { ChannelObject, DatabaseChannel } from '../entities/Channel'
import log from '../../utils/log'
import { bot } from '../..'
import sortObjByKey from '../../utils/sortObjByKey'
import { Connection, Pool } from 'mysql'

export default class ChannelsController {
  readonly cache: Collection<string, Channel> = new Collection()
  private connection: Pool | Connection

  constructor(connection: Pool | Connection) {
    this.connection = connection
    this.makeCache().then(() => {
      setInterval(() => this.syncCached(), env.SYNC_CACHE_INTERVAL * 1000)
    })
  }

  async makeCache(): Promise<void> {
    return await this.getDbChannels().then((dbChannels) => {
      dbChannels.forEach((dbChannel) => {
        try {
          const channel = Channel.restore({
            guild_id: dbChannel.guild_id,
            channel_id: dbChannel.channel_id,
            calc_allowed: JSON.parse(dbChannel.calc_allowed),
          })

          this.cache.set(channel.channel_id.value, channel)
        } catch (error: any) {
          log.error(`Erro ao criar entidades de Channel e setar em cache!`, {
            restLogs: ['\nResult:', dbChannel, '\nErro:', error],
            discord: {
              filename: __filename,
              files: [
                ['error.txt', error.stack || error.message],
                ['result.json', JSON.stringify(dbChannel, null, 2)],
              ],
            },
          })
        }
      })
    })
  }

  syncWithDiscord() {
    const guildChannels = bot.channels.cache.filter(
      (channel) => !!(channel as GuildChannel).guild
    ) as Collection<string, GuildChannel>

    guildChannels.forEach((channel) => {
      if (!this.cache.has(channel.id))
        this.cache.set(
          channel.id,
          Channel.create({ guild_id: channel.guild.id, channel_id: channel.id })
        )
    })

    this.cache.forEach((channel) => {
      if (!bot.channels.cache.has(channel.channel_id.value))
        this.cache.delete(channel.channel_id.value)
    })
  }

  async syncCached() {
    this.getDbChannels().then((dbChannels) => {
      const channelsToDelete = dbChannels
        .map((dbChannel) => dbChannel.channel_id)
        .filter((dbChannelId) => !this.cache.has(dbChannelId))

      const channelsToAdd = this.cache
        .map((channel) => channel.channel_id.value)
        .filter(
          (channelId) =>
            !dbChannels.some((dbChannel) => dbChannel.channel_id === channelId)
        )

      const channelsToUpdate = dbChannels
        .filter((dbChannel) => {
          const cachedChannel = this.cache.get(dbChannel.channel_id)?.dbValue

          return (
            cachedChannel &&
            JSON.stringify(sortObjByKey(dbChannel)) !==
              JSON.stringify(sortObjByKey(cachedChannel))
          )
        })
        .map((dbChannel) => dbChannel.channel_id)

      if (channelsToDelete.length) this.syncCachedDelete(channelsToDelete)
      if (channelsToAdd.length)
        this.syncCachedAdd(channelsToAdd.map((id) => this.cache.get(id)!.value))

      if (channelsToUpdate.length)
        this.syncCachedUpdate(
          channelsToUpdate.map((id) => this.cache.get(id)!.value)
        )
    })
  }

  private async getDbChannels(): Promise<DatabaseChannel[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM channels'

      this.connection.query(
        query,
        async (error, results: DatabaseChannel[]) => {
          if (error) {
            log.error(`Erro ao buscar os canais no banco de dados!`, {
              restLogs: [`\nQuery: ${query}\nErro:`, error],
              discord: {
                filename: __filename,
                description: { content: query, code: true, slice: true },
                files: [
                  ['error.txt', error.stack || error.message],
                  ['error.json', JSON.stringify(error, null, 2)],
                ],
              },
            })

            return reject(error)
          } else return resolve(results)
        }
      )
    })
  }

  private syncCachedDelete(channelsToDelete: string[]) {
    const query = `DELETE FROM channels WHERE channel_id IN (${channelsToDelete
      .map((id) => `'${id}'`)
      .join(', ')})`

    this.connection.query(query, (error, results) => {
      if (error)
        log.error(
          `Erro ao remover os canais do banco de dados durante a sincronização dos dados em cache!`,
          {
            restLogs: [
              `\nQuery: ${query}`,
              '\nchannelsToDelete: ',
              channelsToDelete,
              '\nError: ',
              error,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                [
                  'channelsToDelete.json',
                  JSON.stringify(channelsToDelete, null, 2),
                ],
                ['error.txt', error.stack || error.message],
                ['error.json', JSON.stringify(error, null, 2)],
              ],
            },
          }
        )
      else if (results.affectedRows !== channelsToDelete.length)
        log.error(
          `Uma quantidade incompatível de linhas foi afetada ao tentar remover os canais do banco de dados durante a sincronização dos dados em cache!\nchannelsToDeleteLength: ${channelsToDelete.length}`,
          {
            restLogs: [
              `\nQuery: ${query}`,
              '\nchannelsToDelete: ',
              channelsToDelete,
              '\nOkPacket: ',
              results,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                [
                  'channelsToDelete.json',
                  JSON.stringify(channelsToDelete, null, 2),
                ],
                ['ok_packet.json', JSON.stringify(results, null, 2)],
                [
                  'cached.json',
                  JSON.stringify(
                    this.cache.map((c) => c.value),
                    null,
                    2
                  ),
                ],
              ],
            },
          }
        )
    })
  }

  private syncCachedAdd(channelsToAdd: ChannelObject[]) {
    const query = `INSERT INTO channels (channel_id, guild_id, calc_allowed) VALUES ${channelsToAdd
      .map(
        (channel) =>
          `('${channel.channel_id}', '${channel.guild_id}', '${channel.calc_allowed}')`
      )
      .join(', ')}`

    this.connection.query(query, (error, results) => {
      if (error)
        log.error(
          `Erro ao adicionar os canais no banco de dados durante a sincronização dos dados em cache!`,
          {
            restLogs: [
              `\nQuery: ${query}`,
              '\nchannelsToAdd: ',
              channelsToAdd,
              '\nError: ',
              error,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                ['channelsToAdd.json', JSON.stringify(channelsToAdd, null, 2)],
                ['error.txt', error.stack || error.message],
                ['error.json', JSON.stringify(error, null, 2)],
              ],
            },
          }
        )
      else if (results.affectedRows !== channelsToAdd.length)
        log.error(
          `Uma quantidade incompatível de linhas foi afetada ao tentar adicionar os canais no banco de dados durante a sincronização dos dados em cache!\nchannelsToAddLength: ${channelsToAdd.length}`,
          {
            restLogs: [
              `\nQuery: ${query}`,
              '\nchannelsToAdd: ',
              channelsToAdd,
              '\nOkPacket: ',
              results,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                ['channelsToAdd.json', JSON.stringify(channelsToAdd, null, 2)],
                ['ok_packet.json', JSON.stringify(results, null, 2)],
                [
                  'cached.json',
                  JSON.stringify(
                    this.cache.map((c) => c.value),
                    null,
                    2
                  ),
                ],
              ],
            },
          }
        )
    })
  }

  private syncCachedUpdate(channelsToUpdate: ChannelObject[]) {
    const query = `INSERT INTO channels (channel_id, guild_id, calc_allowed) VALUES ${channelsToUpdate
      .map(
        (channel) =>
          `('${channel.channel_id}', '${channel.guild_id}', '${channel.calc_allowed}')`
      )
      .join(
        ', '
      )} ON DUPLICATE KEY UPDATE channel_id = VALUES(channel_id), guild_id = VALUES(guild_id), calc_allowed = VALUES(calc_allowed)`

    this.connection.query(query, (error, results) => {
      if (error)
        log.error(
          `Erro ao atualizar os canais no banco de dados durante a sincronização dos dados em cache!`,
          {
            restLogs: [
              `\nQuery: ${query}`,
              '\nchannelsToUpdate: ',
              channelsToUpdate,
              '\nError: ',
              error,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                [
                  'channelsToUpdate.json',
                  JSON.stringify(channelsToUpdate, null, 2),
                ],
                ['error.txt', error.stack || error.message],
                ['error.json', JSON.stringify(error, null, 2)],
              ],
            },
          }
        )
      else if (results.affectedRows !== channelsToUpdate.length * 2)
        log.error(
          `Uma quantidade incompatível de linhas foi afetada ao tentar atualizar os canais no banco de dados durante a sincronização dos dados em cache!\nchannelsToUpdateLength: ${channelsToUpdate.length}`,
          {
            restLogs: [
              `\nQuery: ${query}`,
              '\nchannelsToUpdate: ',
              channelsToUpdate,
              '\nOkPacket: ',
              results,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                [
                  'channelsToUpdate.json',
                  JSON.stringify(channelsToUpdate, null, 2),
                ],
                ['ok_packet.json', JSON.stringify(results, null, 2)],
                [
                  'cached.json',
                  JSON.stringify(
                    this.cache.map((c) => c.value),
                    null,
                    2
                  ),
                ],
              ],
            },
          }
        )
    })
  }
}
