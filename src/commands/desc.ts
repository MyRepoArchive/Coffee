import { MessageEmbed } from 'discord.js'
import Command from '../shared/Command'

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
  type: 'utility',
  run: async ({ message, bot, prefix, usedCommand, args }) => {
    const arrayCommandAndAliases = bot.commands.map((command) =>
      command.aliases.concat([command.name])
    )
    let concated: string[] = []
    for (let i = 0; i < arrayCommandAndAliases.length; i++) {
      concated = concated.concat(
        arrayCommandAndAliases[i].concat(arrayCommandAndAliases[i + 1])
      )
    }
    concated = concated.filter((item) => item)

    const descEmbed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle(`Descrição do comando ${prefix}${usedCommand}`)
      .setDescription(
        `Modo de usar: **${prefix}desc avatar**\nOBS: *O comando **${prefix}desc** serve para descrever o comportamento de outros comandos e como usá-los.*`
      )
      .setTimestamp()

    if (!args.length) return message.channel.send({ embeds: [descEmbed] })

    if (args[0].startsWith(prefix)) args[0] = args[0].slice(prefix.length)

    if (!concated.find((aliase) => aliase === args[0]))
      return message.channel.send(`O comando ***${args[0]}*** não existe!`)

    const desc =
      bot.commands.get(args[0])?.description ||
      bot.commands.find((command) => command.aliases.includes(args[0]))
        ?.description ||
      '***`COMANDO SEM DESCRIÇÃO`***'
    const embed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle(`Descrição do comando **${args[0]}**`)
      .setDescription(desc)

    message.channel.send({ embeds: [embed] }).catch(() => {
      message.author.send({ embeds: [embed] })
      message.react('905962263750537257')
    })
  },
})
