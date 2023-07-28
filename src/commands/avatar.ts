import { MessageEmbed, User } from 'discord.js'
import Command, { Data } from '../shared/Command'

export default class extends Command {
  constructor() {
    super({
      name: 'avatar',
      aliases: [
        'mostraravatar',
        'fotodeperfil',
        'imagemdeperfil',
        'imagedeperfil',
        'displayavatar',
      ],
      allowDM: true,
      description:
        'Obtenha o avatar do usuário de maneira baixável e com grande visualização',
      botNecessaryPermissions: [['SEND_MESSAGES']],
      optionsSplit: null,
      options: [
        {
          name: 'usuário',
          description: 'Usuário que deseja obter o avatar',
          type: 'USER',
          fetch: true,
          matchIncluding: true,
        },
      ],
    })
  }

  run = async ({ message, bot }: Data) => {
    const user = (this.formattedArgs[0] as User) || message.author
    const member = message.guild?.members.cache.get(user.id)

    const embed = new MessageEmbed() // Cria a embed
      .setColor(member?.displayHexColor || '#7289DA')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`Avatar de ${member?.displayName || user.username}`)
      .setTimestamp()
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setImage(
        member?.displayAvatarURL({ size: 1024, dynamic: true }) ||
          user.displayAvatarURL({ size: 1024, dynamic: true })
      )

    message.channel.send({ embeds: [embed] })
  }
}
