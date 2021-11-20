import { MessageEmbed } from 'discord.js'
import Command from '../shared/Command'
import { env } from '../utils/env'

export default new Command({
  name: 'eval',
  aliases: ['ev', 'e'],
  type: 'admin',
  allowDM: true,
  botNecessaryPermissions: [['ADD_REACTIONS', 'SEND_MESSAGES']],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run: async ({ message, args, bot }) => {
    const evalContent = args.join(' ')
    const evalEmbed = new MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTimestamp()

    if (!evalContent) return message.channel.send(`Insira um valor válido!`)

    try {
      evalEmbed.setColor('#7289DA')
      evalEmbed.addFields(
        {
          name: 'Input',
          value: `\`\`\`${evalContent}\`\`\``,
        },
        {
          name: 'Output',
          // eslint-disable-next-line no-eval
          value: `\`\`\`${`${eval(evalContent)}`.slice(0, 1000)}\`\`\``,
        }
      )
    } catch (err) {
      evalEmbed.setColor('#FF0000')
      evalEmbed.addFields(
        {
          name: 'Input',
          value: `\`\`\`${evalContent}\`\`\``,
        },
        {
          name: 'Output',
          value: `\`\`\`${err}\`\`\``,
        }
      )
    }

    const msg = await message.channel.send({ embeds: [evalEmbed] })

    await msg.react('905962263750537257')

    const collector = msg.createReactionCollector({
      time: 600000,
      filter: (react, user) =>
        react.emoji.id === '905962263750537257' && env.OWNERS.includes(user.id),
    })

    collector.on('collect', () => {
      msg.edit({ embeds: [], content: `Este eval foi trancado!` })
    })
  },
})
