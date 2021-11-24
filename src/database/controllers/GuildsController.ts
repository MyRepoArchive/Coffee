import Collection from '@discordjs/collection'
import Guild, { GuildObject } from '../entities/Guild'
import { Bot } from '../../shared/Bot'
import { env } from '../../utils/env'
import log from '../../utils/log'
import sortObjByKey from '../../utils/sortObjByKey'
import { Connection, Pool } from 'mysql'

export default class GuildsController {
  readonly cache: Collection<string, Guild> = new Collection()
  private connection: Pool | Connection

  constructor(connection: Pool | Connection) {
    this.connection = connection
    this.makeCache().then(() => {
      setInterval(() => this.syncCached(), env.SYNC_CACHE_INTERVAL * 1000)
    })
  }

  async makeCache(): Promise<void> {
    return await this.getDbGuilds().then((dbGuilds) => {
      dbGuilds.forEach((dbGuild) => {
        try {
          const guild = Guild.restore({
            guild_id: dbGuild.guild_id,
            prefix: dbGuild.prefix,
          })

          this.cache.set(guild.guild_id.value, guild)
        } catch (error: any) {
          log.error(`Erro ao criar entidades de Guild e setar em cache!`, {
            restLogs: ['\nResult: ', dbGuild, '\nErro: ', error],
            discord: {
              filename: __filename,
              files: [
                ['error.txt', error.stack || error.message],
                ['result.json', JSON.stringify(dbGuild, null, 2)],
              ],
            },
          })
        }
      })
    })
  }

  syncWithDiscord(bot: Bot<true>) {
    bot.guilds.cache.forEach((guild) => {
      if (!this.cache.has(guild.id))
        this.cache.set(guild.id, Guild.create({ guild_id: guild.id }))
    })

    this.cache.forEach((guild) => {
      if (!bot.guilds.cache.has(guild.guild_id.value))
        this.cache.delete(guild.guild_id.value)
    })
  }

  async syncCached() {
    this.getDbGuilds().then((dbGuilds) => {
      const guildsToDelete = dbGuilds
        .map((dbGuild) => dbGuild.guild_id)
        .filter((dbGuildId) => !this.cache.has(dbGuildId))

      const guildsToAdd = this.cache
        .map((guild) => guild.guild_id.value)
        .filter(
          (guildId) => !dbGuilds.some((dbGuild) => dbGuild.guild_id === guildId)
        )

      const guildsToUpdate = dbGuilds
        .filter((dbGuild) => {
          const cachedGuild = this.cache.get(dbGuild.guild_id)?.value

          return (
            cachedGuild &&
            JSON.stringify(sortObjByKey(dbGuild)) !==
              JSON.stringify(sortObjByKey(cachedGuild))
          )
        })
        .map((dbGuild) => dbGuild.guild_id)

      if (guildsToDelete.length) this.syncCachedDelete(guildsToDelete)
      if (guildsToAdd.length)
        this.syncCachedAdd(guildsToAdd.map((id) => this.cache.get(id)!.value))

      if (guildsToUpdate.length)
        this.syncCachedUpdate(
          guildsToUpdate.map((id) => this.cache.get(id)!.value)
        )
    })
  }

  private async getDbGuilds(): Promise<GuildObject[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM guilds'

      this.connection.query(query, async (error, results: GuildObject[]) => {
        if (error) {
          log.error(`Erro ao buscar os servidores no banco de dados!`, {
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
      })
    })
  }

  private syncCachedDelete(guildsToDelete: string[]) {
    const query = `DELETE FROM guilds WHERE guild_id IN (${guildsToDelete
      .map((id) => `'${id}'`)
      .join(', ')})`

    this.connection.query(query, (error, results) => {
      if (error)
        log.error(
          `Erro ao remover os servidores do banco de dados durante a sincronização dos dados em cache!`,
          {
            restLogs: [
              `\nQuery: ${query}\nguildsToDelete: `,
              guildsToDelete,
              '\nError: ',
              error,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                [
                  'guildsToDelete.json',
                  JSON.stringify(guildsToDelete, null, 2),
                ],
                ['error.txt', error.stack || error.message],
                ['error.json', JSON.stringify(error, null, 2)],
              ],
            },
          }
        )
      else if (results.affectedRows !== guildsToDelete.length)
        log.error(
          `Uma quantidade incompatível de linhas foi afetada ao tentar remover os servidores do banco de dados durante a sincronização dos dados em cache!\nguildsToDeleteLength: ${guildsToDelete.length}`,
          {
            restLogs: [
              `\nQuery: ${query}\nguildsToDelete: `,
              guildsToDelete,
              '\nOkPacket: ',
              results,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                [
                  'guildsToDelete.json',
                  JSON.stringify(guildsToDelete, null, 2),
                ],
                ['ok_packet.json', JSON.stringify(results, null, 2)],
                [
                  'cached.json',
                  JSON.stringify(
                    this.cache.map((g) => g.value),
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

  private syncCachedAdd(guildsToAdd: GuildObject[]) {
    const query = `INSERT INTO guilds (guild_id, prefix) VALUES ${guildsToAdd
      .map((guild) => `('${guild.guild_id}', '${guild.prefix}')`)
      .join(', ')}`

    this.connection.query(query, (error, results) => {
      if (error)
        log.error(
          `Erro ao adicionar os servidores no banco de dados durante a sincronização dos dados em cache!`,
          {
            restLogs: [
              `\nQuery: ${query}\nguildsToAdd: `,
              guildsToAdd,
              '\nError: ',
              error,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                ['guildsToAdd.json', JSON.stringify(guildsToAdd, null, 2)],
                ['error.txt', error.stack || error.message],
                ['error.json', JSON.stringify(error, null, 2)],
              ],
            },
          }
        )
      else if (results.affectedRows !== guildsToAdd.length)
        log.error(
          `Uma quantidade incompatível de linhas foi afetada ao tentar adicionar os servidores no banco de dados durante a sincronização dos dados em cache!\nguildsToAddLength: ${guildsToAdd.length}`,
          {
            restLogs: [
              `\nQuery: ${query}\nguildsToAdd: `,
              guildsToAdd,
              '\nOkPacket: ',
              results,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                ['guildsToAdd.json', JSON.stringify(guildsToAdd, null, 2)],
                ['ok_packet.json', JSON.stringify(results, null, 2)],
                [
                  'cached.json',
                  JSON.stringify(
                    this.cache.map((g) => g.value),
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

  private syncCachedUpdate(guildsToUpdate: GuildObject[]) {
    const query = `INSERT INTO guilds (guild_id, prefix) VALUES ${guildsToUpdate
      .map((guild) => `('${guild.guild_id}', '${guild.prefix}')`)
      .join(
        ', '
      )} ON DUPLICATE KEY UPDATE guild_id = VALUES(guild_id), prefix = VALUES(prefix)`

    this.connection.query(query, (error, results) => {
      if (error)
        log.error(
          `Erro ao atualizar os servidores no banco de dados durante a sincronização dos dados em cache!`,
          {
            restLogs: [
              `\nQuery: ${query}\nguildsToUpdate: `,
              guildsToUpdate,
              '\nError: ',
              error,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                [
                  'guildsToUpdate.json',
                  JSON.stringify(guildsToUpdate, null, 2),
                ],
                ['error.txt', error.stack || error.message],
                ['error.json', JSON.stringify(error, null, 2)],
              ],
            },
          }
        )
      else if (results.affectedRows !== guildsToUpdate.length * 2)
        log.error(
          `Uma quantidade incompatível de linhas foi afetada ao tentar atualizar os servidores no banco de dados durante a sincronização dos dados em cache!\nguildsToUpdateLength: ${guildsToUpdate.length}`,
          {
            restLogs: [
              `\nQuery: ${query}\nguildsToUpdate: `,
              guildsToUpdate,
              '\nOkPacket: ',
              results,
            ],
            discord: {
              filename: __filename,
              description: { content: query, code: true, slice: true },
              files: [
                ['query.txt', query],
                [
                  'guildsToUpdate.json',
                  JSON.stringify(guildsToUpdate, null, 2),
                ],
                ['ok_packet.json', JSON.stringify(results, null, 2)],
                [
                  'cached.json',
                  JSON.stringify(
                    this.cache.map((g) => g.value),
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
