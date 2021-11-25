import Command from '../shared/Command'
import makeCommandDescEmbed from '../utils/makeCommandDescEmbed'
import { x_ } from '../utils/emojis.json'
import { MessageEmbed } from 'discord.js'

export default new Command({
  name: 'ajuda',
  aliases: ['help'],
  allowDM: true,
  description:
    'Comando usado quando o usuário necessita de ajuda ou precisa saber os comandos do bot',
  type: 'utility',
  run: async ({ args, bot, message, prefix }) => {
    const tiposComandos = [
      ...new Set(bot.commands.map((comando) => comando.type)),
    ]

    const command =
      args[0] &&
      (bot.commands.get(args[0]) ||
        bot.commands.find((cmd) => cmd.aliases.includes(args[0])))

    if (command) {
      const embed = makeCommandDescEmbed(command)

      return message.channel.send({ embeds: [embed] }).catch(() => {
        message.author.send({ embeds: [embed] })
        message.react(x_)
      })
    }

    const embed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle('Comandos')
      .setDescription(
        tiposComandos
          .map(
            (type) =>
              `**${type}**\n> ${bot.commands
                .filter((cmd) => cmd.type === type)
                .map((cmd) => `\`${cmd.name}\``)
                .join(', ')}`
          )
          .join('\n')
      )
      .addField(
        'Detalhes?',
        `Para mais detalhes sobre cada comando utilize *${prefix} desc \`comando\`*`
      )

    message.channel.send({ embeds: [embed] }).catch(() => {
      message.author.send({ embeds: [embed] })
      message.react(x_)
    })
  },
})
