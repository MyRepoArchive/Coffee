import Collection from '@discordjs/collection'
import Guild, { GuildDTO, GuildObject } from '../../entities/Guild'
import { OkPacket } from 'mysql'
import errorTemplate from '../../../utils/errorTemplate'
import chalk from 'chalk'
import getLogChannel from '../../../utils/getLogChannel'
import { Bot } from '../../../shared/Bot'
import Discord, { MessageAttachment } from 'discord.js'
import { env } from '../../../utils/env'
import GuildCreateError from './errors/GuildCreateError'
import GuildDeleteError from './errors/GuildDeleteError'
import GuildBulkCreateError from './errors/GuildBulkCreateError'
import GuildBulkDeleteError from './errors/GuildBulkDeleteError'
import { pool } from '../../..'

export default class GuildsController {
  readonly cache: Collection<string, Guild> = new Collection()

  makeCache(bot: Bot): Promise<this> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM guilds'

      pool.query(query, async (error, results: GuildObject[]) => {
        if (error) {
          console.error(
            errorTemplate(),
            chalk.bold.red(
              `Erro ao buscar os servidores no banco de dados!\nQuery: ${query}\nErro:`,
              error
            )
          )

          const logChannel = await getLogChannel(bot)
          const errorText = new Discord.MessageAttachment(
            Buffer.from(error.stack || error.message),
            'error.txt'
          )
          const errorJson = new Discord.MessageAttachment(
            Buffer.from(JSON.stringify(error, null, 2)),
            'error.json'
          )

          await logChannel?.send({
            content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
            embeds: [
              {
                color: '#FC2A2A',
                footer: {
                  text: __filename,
                },
                timestamp: new Date(),
                title:
                  '<:x_:905962263750537257>  Erro ao buscar os servidores no banco de dados!',
                description: `\`\`\`${query}\`\`\``,
              },
            ],
          })
          await logChannel?.send({ files: [errorText, errorJson] })

          reject(error)
        } else {
          Promise.all(
            results.map(async (result) => {
              try {
                const guild = Guild.restore({
                  guild_id: result.guild_id,
                  prefix: result.prefix,
                })

                this.cache.set(guild.guild_id.value, guild)
              } catch (error: any) {
                console.error(
                  errorTemplate(),
                  chalk.bold.red(
                    `Erro ao criar entidades de Guild e setar em cache!\nResult: ${JSON.stringify(
                      result,
                      null,
                      2
                    )}\nErro:`,
                    error
                  )
                )

                const logChannel = await getLogChannel(bot)
                const errorText = new Discord.MessageAttachment(
                  Buffer.from(error.stack || error.message),
                  'error.txt'
                )
                const resultJson = new Discord.MessageAttachment(
                  Buffer.from(JSON.stringify(result, null, 2)),
                  'result.json'
                )

                await logChannel?.send({
                  content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
                  embeds: [
                    {
                      color: '#FC2A2A',
                      footer: {
                        text: __filename,
                      },
                      timestamp: new Date(),
                      title:
                        '<:x_:905962263750537257>  Erro ao criar entidades de Guild e setar em cache!',
                    },
                  ],
                })
                await logChannel?.send({ files: [errorText, resultJson] })

                throw error
              }
            })
          ).then(
            () => resolve(this),
            (error) => reject(error)
          )
        }
      })
    })
  }

  create(
    guildDTO: GuildDTO
  ): Promise<{ guild: Guild; results: OkPacket; query: string }> {
    return new Promise((resolve, reject) => {
      const guild = Guild.create(guildDTO)
      const query = `INSERT INTO guilds (guild_id, prefix) VALUES ('${
        guild.guild_id.value
      }', '${guild.prefix.value.replace(/\\/g, '\\\\')}')`

      pool.query(query, (error, results) => {
        if (error) reject(new GuildCreateError('Error', query, error, results))
        else {
          if (results.affectedRows === 1) {
            resolve({ results, query, guild })
            this.cache.set(guild.guild_id.value, guild)
          } else if (results.affectedRows > 1) {
            reject(
              new GuildCreateError(
                'Mais de uma linha afetada',
                query,
                error,
                results
              )
            )
            this.cache.clear()
          } else
            reject(
              new GuildCreateError(
                'Nenhuma linha afetada',
                query,
                error,
                results
              )
            )
        }
      })
    })
  }

  bulkCreate(
    guildsDTO: GuildDTO[]
  ): Promise<{ guilds: Guild[]; results: OkPacket; query: string }> {
    return new Promise((resolve, reject) => {
      const guilds = guildsDTO.map((guildDTO) => Guild.create(guildDTO))
      const query = `INSERT INTO guilds (guild_id, prefix) VALUES ${guilds
        .map(
          (guild) =>
            `('${guild.guild_id.value}', '${guild.prefix.value.replace(
              /\\/g,
              '\\\\'
            )}')`
        )
        .join(', ')}`

      pool.query(query, (error, results) => {
        if (error)
          reject(new GuildBulkCreateError('Error', query, error, results))
        else {
          if (results.affectedRows === guilds.length) {
            resolve({ results, query, guilds })
            guilds.forEach((guild) =>
              this.cache.set(guild.guild_id.value, guild)
            )
          } else {
            reject(
              new GuildBulkCreateError(
                'Quantidade de linhas afetadas incompatível',
                query,
                error,
                results
              )
            )
            this.cache.clear()
          }
        }
      })
    })
  }

  delete(guildId: string): Promise<{ results: OkPacket; query: string }> {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM guilds WHERE guild_id = '${guildId}'`

      pool.query(query, (error, results) => {
        if (error) reject(new GuildDeleteError('Error', query, error, results))
        else {
          if (results.affectedRows === 1) {
            resolve({ results, query })
            this.cache.delete(guildId)
          } else if (results.affectedRows > 1) {
            reject(
              new GuildDeleteError(
                'Mais de uma linha afetada',
                query,
                error,
                results
              )
            )
            this.cache.clear()
          } else
            reject(
              new GuildDeleteError(
                'Nenhuma linha afetada',
                query,
                error,
                results
              )
            )
        }
      })
    })
  }

  bulkDelete(
    guildIds: string[]
  ): Promise<{ results: OkPacket; query: string }> {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM guilds WHERE guild_id IN (${guildIds
        .map((guildId) => `'${guildId}'`)
        .join(', ')})`

      pool.query(query, (error, results) => {
        if (error)
          reject(new GuildBulkDeleteError('Error', query, error, results))
        else {
          if (results.affectedRows === guildIds.length) {
            resolve({ results, query })
            guildIds.forEach((guildId) => this.cache.delete(guildId))
          } else {
            reject(
              new GuildBulkCreateError(
                'Quantidade de linhas afetadas incompatível',
                query,
                error,
                results
              )
            )
            this.cache.clear()
          }
        }
      })
    })
  }

  fetch(
    guildId: string,
    bot: Bot,
    options?: { force?: boolean }
  ): Promise<Guild | undefined> {
    return new Promise((resolve, reject) => {
      if (!options?.force) {
        const cachedGuild = this.cache.get(guildId)

        if (cachedGuild) return resolve(cachedGuild)
      }

      const query = `SELECT * FROM guilds WHERE guild_id = '${guildId}'`

      pool.query(query, async (error, results) => {
        if (error) {
          console.error(
            errorTemplate(),
            chalk.bold.red(
              `Erro ao buscar um servidor no banco de dados!\nQuery: ${query}\nErro:`,
              error
            )
          )

          const logChannel = await getLogChannel(bot)
          const errorText = new Discord.MessageAttachment(
            Buffer.from(error.stack || error.message),
            'error.txt'
          )
          const errorJson = new Discord.MessageAttachment(
            Buffer.from(JSON.stringify(error, null, 2)),
            'error.json'
          )

          await logChannel?.send({
            content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
            embeds: [
              {
                color: '#FC2A2A',
                footer: {
                  text: __filename,
                },
                timestamp: new Date(),
                title:
                  '<:x_:905962263750537257>  Erro ao buscar um servidor no banco de dados!',
                description: `\`\`\`${query}\`\`\``,
              },
            ],
          })
          await logChannel?.send({ files: [errorText, errorJson] })

          reject(error)
        } else {
          if (results.length === 1) {
            const guild = Guild.restore({
              guild_id: results[0].guild_id,
              prefix: results[0].prefix,
            })

            this.cache.set(guild.guild_id.value, guild)
            resolve(guild)
          } else if (results.length > 1) {
            this.cache.clear()

            console.error(
              errorTemplate(),
              chalk.bold.red(
                `Mais de um registro foi encontrado ao tentar buscar um servidor no bancos de dados!\nQuery: ${query}\nResults:`,
                JSON.stringify(results, null, 2)
              )
            )

            const logChannel = await getLogChannel(bot)

            const resultsJson = new Discord.MessageAttachment(
              Buffer.from(JSON.stringify(results, null, 2)),
              'results.json'
            )

            await logChannel?.send({
              content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
              embeds: [
                {
                  color: '#FC2A2A',
                  footer: {
                    text: __filename,
                  },
                  timestamp: new Date(),
                  title:
                    '<:x_:905962263750537257>  Mais de um registro foi encontrado ao tentar buscar um servidor no bancos de dados!',
                  description: `\`\`\`${query}\`\`\``,
                },
              ],
            })
            await logChannel?.send({ files: [resultsJson] })

            reject(new Error())
          } else resolve(undefined)
        }
      })
    })
  }

  async syncWithDiscord(bot: Bot<true>): Promise<this> {
    const guildsDTO: GuildDTO[] = []
    const guildsToDelete: string[] = []

    await Promise.all(
      bot.guilds.cache.map(async (guild) => {
        const dbGuild = await this.fetch(guild.id, bot)

        if (!dbGuild) guildsDTO.push({ guild_id: guild.id })
      })
    )

    await this.makeCache(bot)

    this.cache.forEach((guild) => {
      const discordGuild = bot.guilds.cache.get(guild.guild_id.value)

      if (!discordGuild) guildsToDelete.push(guild.guild_id.value)
    })

    if (guildsDTO.length)
      await this.bulkCreate(guildsDTO).catch(
        async (error: GuildBulkCreateError) => {
          if (error.reason === 'Error') {
            console.error(
              errorTemplate(),
              chalk.bold.red(
                `Erro ao cadastrar novos servidores no banco de dados!\nQuery: ${error.query}\nGuildsDTO: ${guildsDTO}\nErro:`,
                error.mysqlError
              )
            )

            const logChannel = await getLogChannel(bot)

            const queryText = new MessageAttachment(
              Buffer.from(error.query),
              'query.txt'
            )
            const errorText = new MessageAttachment(
              Buffer.from(error.mysqlError!.stack || error.mysqlError!.message),
              'error.txt'
            )
            const errorJson = new MessageAttachment(
              Buffer.from(JSON.stringify(error.mysqlError, null, 2)),
              'error.json'
            )
            const guildsDTOJson = new MessageAttachment(
              Buffer.from(JSON.stringify(guildsDTO, null, 2)),
              'guildsDTO.json'
            )

            await logChannel?.send({
              content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
              embeds: [
                {
                  color: '#FC2A2A',
                  footer: {
                    text: __filename,
                  },
                  timestamp: new Date(),
                  title: `<:x_:905962263750537257>  Erro ao cadastrar novos servidores no banco de dados!`,
                  description: `\`\`\`${error.query.slice(0, 4000)}\`\`\``,
                },
              ],
            })
            await logChannel?.send({
              files: [queryText, errorText, errorJson, guildsDTOJson],
            })
          } else {
            console.error(
              errorTemplate(),
              chalk.bold.red(
                `Uma quantidade diferente de linhas foram afetadas ao cadastrar novos servidores no banco de dados!\nQuery: ${error.query}\nGuildsDTO: ${guildsDTO}\nOkPacket:`,
                JSON.stringify(error.results, null, 2)
              )
            )

            const logChannel = await getLogChannel(bot)

            const queryText = new MessageAttachment(
              Buffer.from(error.query),
              'query.txt'
            )
            const okPacketJson = new MessageAttachment(
              Buffer.from(JSON.stringify(error.results, null, 2)),
              'ok_packet.json'
            )
            const guildsDTOJson = new MessageAttachment(
              Buffer.from(JSON.stringify(guildsDTO, null, 2)),
              'guildsDTO.json'
            )

            await logChannel?.send({
              content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
              embeds: [
                {
                  color: '#FC2A2A',
                  footer: {
                    text: __filename,
                  },
                  timestamp: new Date(),
                  title: `<:x_:905962263750537257>  Uma quantidade diferente de linhas foram afetadas ao cadastrar novos servidores no banco de dados!`,
                  description: `\`\`\`${error.query.slice(0, 4000)}\`\`\``,
                },
              ],
            })
            await logChannel?.send({
              files: [queryText, okPacketJson, guildsDTOJson],
            })
          }
          throw error
        }
      )

    if (guildsToDelete.length) {
      await this.bulkDelete(guildsToDelete).catch(
        async (error: GuildBulkDeleteError) => {
          if (error.reason === 'Error') {
            console.error(
              errorTemplate(),
              chalk.bold.red(
                `Erro ao remover servidores do banco de dados!\nQuery: ${error.query}\nguildsToDelete: ${guildsToDelete}\nErro:`,
                error.mysqlError
              )
            )

            const logChannel = await getLogChannel(bot)

            const queryText = new MessageAttachment(
              Buffer.from(error.query),
              'query.txt'
            )
            const errorText = new MessageAttachment(
              Buffer.from(error.mysqlError!.stack || error.mysqlError!.message),
              'error.txt'
            )
            const errorJson = new MessageAttachment(
              Buffer.from(JSON.stringify(error.mysqlError, null, 2)),
              'error.json'
            )
            const guildsToDeleteJson = new MessageAttachment(
              Buffer.from(JSON.stringify(guildsToDelete, null, 2)),
              'guildsToDelete.json'
            )

            await logChannel?.send({
              content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
              embeds: [
                {
                  color: '#FC2A2A',
                  footer: {
                    text: __filename,
                  },
                  timestamp: new Date(),
                  title: `<:x_:905962263750537257>  Erro ao remover servidores do banco de dados!`,
                  description: `\`\`\`${error.query.slice(0, 4000)}\`\`\``,
                },
              ],
            })
            await logChannel?.send({
              files: [queryText, errorText, errorJson, guildsToDeleteJson],
            })
          } else {
            console.error(
              errorTemplate(),
              chalk.bold.red(
                `Uma quantidade diferente de linhas foram afetadas ao remover servidores do banco de dados!\nQuery: ${error.query}\nguildsToDelete: ${guildsToDelete}\nOkPacket:`,
                JSON.stringify(error.results, null, 2)
              )
            )

            const logChannel = await getLogChannel(bot)

            const queryText = new MessageAttachment(
              Buffer.from(error.query),
              'query.txt'
            )
            const okPacketJson = new MessageAttachment(
              Buffer.from(JSON.stringify(error.results, null, 2)),
              'ok_packet.json'
            )
            const guildsToDeleteJson = new MessageAttachment(
              Buffer.from(JSON.stringify(guildsToDelete, null, 2)),
              'guildsToDelete.json'
            )

            await logChannel?.send({
              content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
              embeds: [
                {
                  color: '#FC2A2A',
                  footer: {
                    text: __filename,
                  },
                  timestamp: new Date(),
                  title: `<:x_:905962263750537257>  Uma quantidade diferente de linhas foram afetadas ao remover servidores do banco de dados!`,
                  description: `\`\`\`${error.query.slice(0, 4000)}\`\`\``,
                },
              ],
            })
            await logChannel?.send({
              files: [queryText, okPacketJson, guildsToDeleteJson],
            })
          }
          throw error
        }
      )
    }

    return this
  }
}
