import Command from '../shared/Command'

export default new Command({
  name: 'botusers',
  aliases: ['usersbot'],
  allowDM: true,
  botNecessaryPermissions: [['SEND_MESSAGES']],
  description: 'Mostra a quantidade de usuários que o bot está tendo acesso',
  run: async ({ message, bot }) => {
    message.channel.send(
      `Tenho acesso a **${bot.users.cache.size}** usuários, **${
        bot.users.cache.filter((user) => !user.bot).size
      }** são pessoas e **${
        bot.users.cache.filter((user) => user.bot).size
      }** são bots`
    )
  },
})
