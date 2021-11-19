import Collection from '@discordjs/collection'
import mysql, { OkPacket } from 'mysql'
import mySqlConfig from '../../../utils/mySqlConfig'
import getLogChannel from '../../../utils/getLogChannel'
import { Bot } from '../../../shared/Bot'
import Discord, { GuildChannel, MessageAttachment } from 'discord.js'
import { env } from '../../../utils/env'
import Channel, { ChannelDTO, DatabaseChannel } from '../../entities/Channel'
import log from '../../../utils/log'
import ChannelBulkCreateError from './errors/ChannelBulkCreateError'
import ChannelBulkDeleteError from './errors/ChannelBulkDeleteError'

export default class ChannelsController {
  readonly cache: Collection<string, Channel> = new Collection()

  makeCache(bot: Bot): Promise<this> {
    return new Promise((resolve, reject) => {
      const pool = mysql.createPool(mySqlConfig)
      const query = 'SELECT * FROM channels'

      pool.query(query, async (error, results: DatabaseChannel[]) => {
        pool.end()

        if (error) {
          log.error(
            `Erro ao buscar os canais no banco de dados!\nQuery: ${query}\nErro:`,
            error
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
                  '<:x_:905962263750537257>  Erro ao buscar os canais no banco de dados!',
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
                const channel = Channel.restore({
                  guild_id: result.guild_id,
                  channel_id: result.channel_id,
                  calc_allowed: JSON.parse(result.calc_allowed),
                })

                this.cache.set(channel.channel_id.value, channel)
              } catch (error: any) {
                log.error(
                  `Erro ao criar entidades de Channel e setar em cache!\nResult: ${JSON.stringify(
                    result,
                    null,
                    2
                  )}\nErro:`,
                  error
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
                        '<:x_:905962263750537257>  Erro ao criar entidades de Channel e setar em cache!',
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

  /* create(
    guildDTO: GuildDTO
  ): Promise<{ guild: Guild; results: OkPacket; query: string }> {
    return new Promise((resolve, reject) => {
      const pool = mysql.createPool(mySqlConfig)
      const guild = Guild.create(guildDTO)
      const query = `INSERT INTO guilds (guild_id, prefix) VALUES ('${
        guild.guild_id.value
      }', '${guild.prefix.value.replace(/\\/g, '\\\\')}')`

      pool.query(query, (error, results) => {
        pool.end()

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
  } */

  bulkCreate(
    channelsDTO: ChannelDTO[]
  ): Promise<{ channels: Channel[]; results: OkPacket; query: string }> {
    return new Promise((resolve, reject) => {
      const pool = mysql.createPool(mySqlConfig)
      const channels = channelsDTO.map((channelDTO) =>
        Channel.create(channelDTO)
      )
      const query = `INSERT INTO channels (channel_id, guild_id, calc_allowed) VALUES ${channels
        .map(
          (channel) =>
            `('${channel.channel_id.value}', '${channel.guild_id.value}', '${channel.calc_allowed.value}')`
        )
        .join(', ')}`

      pool.query(query, (error, results) => {
        pool.end()

        if (error)
          reject(new ChannelBulkCreateError('Error', query, error, results))
        else {
          if (results.affectedRows === channels.length) {
            resolve({ results, query, channels: channels })
            channels.forEach((channel) =>
              this.cache.set(channel.channel_id.value, channel)
            )
          } else {
            reject(
              new ChannelBulkCreateError(
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

  /* delete(guildId: string): Promise<{ results: OkPacket; query: string }> {
    return new Promise((resolve, reject) => {
      const pool = mysql.createPool(mySqlConfig)
      const query = `DELETE FROM guilds WHERE guild_id = '${guildId}'`

      pool.query(query, (error, results) => {
        pool.end()

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
  } */

  bulkDelete(
    channelIds: string[]
  ): Promise<{ results: OkPacket; query: string }> {
    return new Promise((resolve, reject) => {
      const pool = mysql.createPool(mySqlConfig)
      const query = `DELETE FROM channels WHERE channel_id IN (${channelIds
        .map((channelId) => `'${channelId}'`)
        .join(', ')})`

      pool.query(query, (error, results) => {
        pool.end()

        if (error)
          reject(new ChannelBulkDeleteError('Error', query, error, results))
        else {
          if (results.affectedRows === channelIds.length) {
            resolve({ results, query })
            channelIds.forEach((channelId) => this.cache.delete(channelId))
          } else {
            reject(
              new ChannelBulkDeleteError(
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
    channelId: string,
    bot: Bot,
    options?: { force?: boolean }
  ): Promise<Channel | undefined> {
    return new Promise((resolve, reject) => {
      if (!options?.force) {
        const cachedChannel = this.cache.get(channelId)

        if (cachedChannel) return resolve(cachedChannel)
      }

      const pool = mysql.createPool(mySqlConfig)
      const query = `SELECT * FROM channels WHERE channel_id = '${channelId}'`

      pool.query(query, async (error, results: [DatabaseChannel]) => {
        pool.end()

        if (error) {
          log.error(
            `Erro ao buscar um canal no banco de dados!\nQuery: ${query}\nErro:`,
            error
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
                  '<:x_:905962263750537257>  Erro ao buscar um canal no banco de dados!',
                description: `\`\`\`${query}\`\`\``,
              },
            ],
          })
          await logChannel?.send({ files: [errorText, errorJson] })

          reject(error)
        } else {
          if (results.length === 1) {
            const channel = Channel.restore({
              guild_id: results[0].guild_id,
              channel_id: results[0].channel_id,
              calc_allowed: JSON.parse(results[0].calc_allowed),
            })

            this.cache.set(channel.channel_id.value, channel)
            resolve(channel)
          } else if (results.length > 1) {
            this.cache.clear()

            log.error(
              `Mais de um registro foi encontrado ao tentar buscar um canal no bancos de dados!\nQuery: ${query}\nResults:`,
              JSON.stringify(results, null, 2)
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
                    '<:x_:905962263750537257>  Mais de um registro foi encontrado ao tentar buscar um canal no bancos de dados!',
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
    const channelsDTO: ChannelDTO[] = []
    const channelsToDelete: string[] = []

    await Promise.all(
      (
        bot.channels.cache.filter(
          (channel) => !!(channel as GuildChannel).guild
        ) as Collection<string, GuildChannel>
      ).map(async (channel) => {
        const dbChannel = await this.fetch(channel.id, bot)

        if (!dbChannel)
          channelsDTO.push({
            channel_id: channel.id,
            guild_id: channel.guildId,
          })
      })
    )

    await this.makeCache(bot)

    this.cache.forEach((channel) => {
      const discordChannel = bot.channels.cache.get(channel.channel_id.value)

      if (!discordChannel) channelsToDelete.push(channel.channel_id.value)
    })

    if (channelsDTO.length)
      await this.bulkCreate(channelsDTO).catch(
        async (error: ChannelBulkCreateError) => {
          if (error.reason === 'Error') {
            log.error(
              `Erro ao cadastrar novos canais no banco de dados!\nQuery: ${error.query}\nChannelsDTO: ${channelsDTO}\nErro:`,
              error.mysqlError
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
            const channelsDTOJson = new MessageAttachment(
              Buffer.from(JSON.stringify(channelsDTO, null, 2)),
              'channelsDTO.json'
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
                  title: `<:x_:905962263750537257>  Erro ao cadastrar novos canais no banco de dados!`,
                  description: `\`\`\`${error.query.slice(0, 4000)}\`\`\``,
                },
              ],
            })
            await logChannel?.send({
              files: [queryText, errorText, errorJson, channelsDTOJson],
            })
          } else {
            log.error(
              `Uma quantidade diferente de linhas foram afetadas ao cadastrar novos canais no banco de dados!\nQuery: ${error.query}\nChannelsDTO: ${channelsDTO}\nOkPacket:`,
              JSON.stringify(error.results, null, 2)
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
            const channelsDTOJson = new MessageAttachment(
              Buffer.from(JSON.stringify(channelsDTO, null, 2)),
              'channelsDTO.json'
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
                  title: `<:x_:905962263750537257>  Uma quantidade diferente de linhas foram afetadas ao cadastrar novos canais no banco de dados!`,
                  description: `\`\`\`${error.query.slice(0, 4000)}\`\`\``,
                },
              ],
            })
            await logChannel?.send({
              files: [queryText, okPacketJson, channelsDTOJson],
            })
          }
          throw error
        }
      )

    if (channelsToDelete.length) {
      await this.bulkDelete(channelsToDelete).catch(
        async (error: ChannelBulkDeleteError) => {
          if (error.reason === 'Error') {
            log.error(
              `Erro ao remover canais do banco de dados!\nQuery: ${error.query}\nchannelsToDelete: ${channelsToDelete}\nErro:`,
              error.mysqlError
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
            const channelsToDeleteJson = new MessageAttachment(
              Buffer.from(JSON.stringify(channelsToDelete, null, 2)),
              'channelsToDelete.json'
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
                  title: `<:x_:905962263750537257>  Erro ao remover canais do banco de dados!`,
                  description: `\`\`\`${error.query.slice(0, 4000)}\`\`\``,
                },
              ],
            })
            await logChannel?.send({
              files: [queryText, errorText, errorJson, channelsToDeleteJson],
            })
          } else {
            log.error(
              `Uma quantidade diferente de linhas foram afetadas ao remover canais do banco de dados!\nQuery: ${error.query}\nchannelsToDelete: ${channelsToDelete}\nOkPacket:`,
              JSON.stringify(error.results, null, 2)
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
            const channelsToDeleteJson = new MessageAttachment(
              Buffer.from(JSON.stringify(channelsToDelete, null, 2)),
              'channelsToDelete.json'
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
                  title: `<:x_:905962263750537257>  Uma quantidade diferente de linhas foram afetadas ao remover canais do banco de dados!`,
                  description: `\`\`\`${error.query.slice(0, 4000)}\`\`\``,
                },
              ],
            })
            await logChannel?.send({
              files: [queryText, okPacketJson, channelsToDeleteJson],
            })
          }
          throw error
        }
      )
    }

    return this
  }
}
