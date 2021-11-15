import { MessageEmbed } from 'discord.js'
import Command from '../shared/Command'

export default new Command({
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
  run: async ({ message, args, isGuild, bot }) => {
    const member =
      (isGuild &&
        (message.mentions.members?.first() ||
          message.guild!.members.cache.find(
            (member) =>
              member.user.username.toLowerCase() ===
              args.join(' ').toLowerCase()
          ) ||
          message.guild!.members.cache.find(
            (member) =>
              member.displayName.toLowerCase() === args.join(' ').toLowerCase()
          ) ||
          message.guild!.members.cache.get(args[0]) ||
          message.guild!.members.cache.find((member) =>
            args.length === 0
              ? member.id === message.member!.id
              : member.user.tag
                  .toLowerCase()
                  .includes(args.join(' ').toLowerCase())
          ) ||
          message.guild!.members.cache.find((member) =>
            args.length === 0
              ? member.id === message.member!.id
              : member.displayName
                  .toLowerCase()
                  .includes(args.join(' ').toLowerCase())
          ))) ||
      undefined

    const user =
      (await bot.users.fetch(args[0]).catch(() => {})) || message.author

    const embed = new MessageEmbed() // Cria a embed
      .setColor(member?.displayHexColor || '#7289DA')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`Avatar de ${member?.displayName || user.username}`)
      .setTimestamp()
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setImage(
        member?.user.displayAvatarURL({ size: 1024, dynamic: true }) ||
          user.displayAvatarURL({ size: 1024, dynamic: true })
      )

    message.channel.send({ embeds: [embed] })
  },
})
