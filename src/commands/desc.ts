import { MessageEmbed } from 'discord.js'
import Command from '../shared/Command'
import { x_ } from '../utils/emojis.json'
import makeCommandDescEmbed from '../utils/makeCommandDescEmbed'

export default new Command({
  name: 'desc',
  aliases: [
    'descreva',
    'describe',
    'guia',
    'howtouse',
    'comousa',
    'comouso',
    'mododeusar',
    'mododeuso',
    'comousar',
  ],
  description:
    'Mostra a descrição de cada comando!\nModo de usar: **@Coffee desc avatar**',
  allowDM: true,
  category: 'utility',
  run: async ({ message, bot, prefix, usedCommand, args }) => {
    const descEmbed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle(`Descrição do comando ${prefix}${usedCommand}`)
      .setDescription(
        `Modo de usar: **${prefix}desc avatar**\nOBS: *O comando **${prefix}desc** serve para descrever o comportamento de outros comandos e como usá-los.*`
      )
      .setTimestamp()

    if (!args.length) return message.channel.send({ embeds: [descEmbed] })

    if (args[0].startsWith(prefix)) args[0] = args[0].slice(prefix.length)

    const cmd =
      bot.commands.get(args[0]) ||
      bot.commands.find((command) => command.aliases.includes(args[0]))

    if (!cmd)
      return message.channel.send(`O comando ***${args[0]}*** não existe!`)

    const embed = makeCommandDescEmbed(cmd)

    message.channel.send({ embeds: [embed] }).catch(() => {
      message.author.send({ embeds: [embed] })
      message.react(x_)
    })
  },
})
