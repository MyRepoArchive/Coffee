import { MessageEmbed } from 'discord.js'
import Command from '../shared/Command'
import { x_ } from '../utils/emojis.json'

export default new Command({
  name: 'commandlist',
  aliases: ['listacomandos', 'listadecomandos', 'cl'],
  allowDM: true,
  description:
    'Exibe em uma Embed uma lista com o nome prímário de todos os comandos do bot',
  type: 'utility',
  run: async ({ message, bot, prefix }) => {
    const commands = [...new Set(bot.commands.map((command) => command.name))]
    const embed = new MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setColor('#7289DA')
      .setTitle(`Minha listinha de comandos (${commands.length})`)
      .setDescription(`\`${commands.join('`, `')}\``)
      .addField(
        `Observação`,
        `Se você estiver precisando de algo mais detalhado, use *${prefix} desc \`comando\`* ou *${prefix} ajuda*`
      )

    message.channel.send({ embeds: [embed] }).catch(() => {
      message.author.send({ embeds: [embed] })
      message.react(x_)
    })
  },
})
