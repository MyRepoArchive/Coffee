import Command, { Data } from '../shared/Command'

export default class extends Command {
  constructor() {
    super({
      name: 'botusers',
      aliases: ['usersbot', 'bu'],
      allowDM: true,
      botNecessaryPermissions: [['SEND_MESSAGES']],
      description:
        'Mostra a quantidade de usuários que o bot está tendo acesso',
    })
  }

  run = async ({ message, bot }: Data) => {
    message.channel.send(
      `Tenho acesso a **${bot.users.cache.size}** usuários, **${
        bot.users.cache.filter((user) => !user.bot).size
      }** são pessoas e **${
        bot.users.cache.filter((user) => user.bot).size
      }** são bots`
    )
  }
}
