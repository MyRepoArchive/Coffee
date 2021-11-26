import Guild from '../database/entities/Guild'
import { Prefix } from '../database/objectValues/Prefix'
import Command from '../shared/Command'
import { check, x_ } from '../utils/emojis.json'

export default new Command({
  name: 'setprefix',
  aliases: ['sp'],
  description:
    'Seta um prefixo específico para o servidor em que é utilizado o comando.',
  memberNecessaryPermissions: [['MANAGE_GUILD']],
  type: 'configuration',
  run: async ({ args, bot, message, dbPrefix }) => {
    if (!args[0]) {
      return message.channel.send('Por favor, especifique um prefixo.')
    }

    let prefixEntity: Prefix

    try {
      prefixEntity = Prefix.create(args[0], 'prefixo')
    } catch (error: any) {
      return message.channel.send(`<:x_:${x_}> ${error.message}`)
    }

    bot.database.guilds.cache.set(
      message.guild!.id,
      Guild.restore({ guild_id: message.guild!.id, prefix: prefixEntity.value })
    )

    message.channel.send(
      `<:check:${check}> Prefixo alterado com sucesso! \`${dbPrefix}\` → \`${prefixEntity.value}\``
    )
  },
})
