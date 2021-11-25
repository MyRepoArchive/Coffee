import { MessageEmbed } from 'discord.js'
import { bot } from '..'
import Command from '../shared/Command'
import { x_, check } from './emojis.json'

export default (command: Command) => {
  return new MessageEmbed()
    .setColor('#7289DA')
    .setTitle(`Comando: **${command.name}**`)
    .setDescription(`${command.description ?? '***`COMANDO SEM DESCRIÇÃO`***'}`)
    .addFields([
      {
        name: 'Aliases',
        value:
          command.aliases.map((al) => `\`${al}\``).join(', ') ||
          '***`COMANDO SEM ALIAS`***',
        inline: true,
      },
      {
        name: 'Tipo',
        value: command.type,
        inline: true,
      },
      {
        name: 'Permissões',
        value: `Uso em DM: ${bot.emojis.cache.get(
          command.allowDM ? check : x_
        )}\nUso por bots: ${bot.emojis.cache.get(
          command.allowBot ? check : x_
        )}\nPermissões necessárias: ${
          command.memberNecessaryPermissions
            .filter((permGroup) => permGroup.length)
            .map((permGroup) => `\`${permGroup.join(' e ')}\``)
            .join(' ou ') || '**Nenhuma**'
        }`,
        inline: true,
      },
    ])
}
