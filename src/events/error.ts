import chalk from 'chalk'
import { MessageAttachment } from 'discord.js'
import { bot } from '..'
import Event from '../shared/Event'
import { env } from '../utils/env'
import errorTemplate from '../utils/errorTemplate'
import getLogChannel from '../utils/getLogChannel'

export default new Event('error', async (error) => {
  console.error(
    errorTemplate(),
    chalk.bold.red('Um erro foi emitido pelo bot!\nErro:'),
    error
  )

  const logChannel = await getLogChannel(bot)
  const attachment = new MessageAttachment(
    Buffer.from(error.stack || error.message),
    'error.txt'
  )

  await logChannel.send({
    content: env.OWNERS.map((id) => `<@${id}>`).join(', '),
    embeds: [
      {
        color: '#FC2A2A',
        footer: {
          text: __filename,
        },
        timestamp: new Date(),
        title: '<:x_:905962263750537257>  Um erro foi emitido pelo bot!',
      },
    ],
  })
  await logChannel.send({
    files: [attachment],
  })
})
