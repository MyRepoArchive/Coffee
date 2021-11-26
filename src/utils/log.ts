import chalk from 'chalk'
import { MessageAttachment } from 'discord.js'
import { bot } from '..'
import { env } from './env'
import errorTemplate from './errorTemplate'
import getLogChannel from './getLogChannel'
import infoTemplate from './infoTemplate'
import successTemplate from './successTemplate'
import emojis from './emojis.json'

export default {
  info: (
    message: string,
    options?: {
      restLogs?: any[]
      discord?: {
        emoji?: 'in' | 'onoff' | 'out' | 'save' | 'info'
        title?: string
        description?: string
      }
    }
  ) => {
    console.info(infoTemplate(), message, ...(options?.restLogs || []))

    if (options?.discord) {
      const emoji = bot.emojis.cache.get(
        emojis[options.discord.emoji || 'info']
      )

      getLogChannel(bot).then((channel) => {
        channel.send({
          embeds: [
            {
              color: '#00FFFF',
              timestamp: new Date(),
              title: `${emoji || ''}  ${options.discord!.title || message}`,
              description: options.discord!.description,
            },
          ],
        })
      })
    }
  },

  success: (
    message: string,
    options?: {
      restLogs?: any[]
      discord?: {
        emoji?: 'check'
        title?: string
        description?: string
      }
    }
  ) => {
    console.info(successTemplate(), message, ...(options?.restLogs || []))

    if (options?.discord) {
      const emoji = bot.emojis.cache.get(
        emojis[options.discord.emoji || 'check']
      )

      getLogChannel(bot).then((channel) => {
        channel.send({
          embeds: [
            {
              color: '#00FF75',
              timestamp: new Date(),
              title: `${emoji || ''}  ${options.discord!.title || message}`,
              description: options.discord!.description,
            },
          ],
        })
      })
    }
  },

  error: (
    message: string,
    options?: {
      restLogs?: any[]
      discord?: {
        filename: string
        emoji?: 'x_'
        title?: string
        description?: {
          code?: boolean
          content: string
          slice?: boolean
        }
        files?: [string, string][]
      }
    }
  ) => {
    console.error(
      errorTemplate(),
      chalk.red(message),
      ...(options?.restLogs || [])
    )

    if (options?.discord) {
      const emoji = bot.emojis.cache.get(emojis[options.discord.emoji || 'x_'])

      getLogChannel(bot).then(async (channel) => {
        await channel.send({
          content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
          embeds: [
            {
              color: '#FC2A2A',
              footer: {
                text: options.discord!.filename,
              },
              timestamp: new Date(),
              title: `${emoji || ''}  ${options.discord!.title || message}`,
              description:
                options.discord!.description &&
                (options.discord!.description.code
                  ? `\`\`\`${options.discord!.description.content.slice(
                      0,
                      options.discord!.description.slice
                        ? 2000
                        : options.discord!.description.content.length
                    )}\`\`\``
                  : options.discord!.description.content.slice(
                      0,
                      options.discord!.description.slice
                        ? 2048
                        : options.discord!.description.content.length
                    )),
            },
          ],
        })

        if (options.discord!.files) {
          const attachments = options.discord!.files.map(
            ([name, content]) =>
              new MessageAttachment(Buffer.from(content), name)
          )

          await channel.send({ files: attachments })
        }
      })
    }
  },
}
