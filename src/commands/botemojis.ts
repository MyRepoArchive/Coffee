import Command from '../shared/Command'

export default new Command({
  name: 'botemojis',
  aliases: ['emojisbot', 'be'],
  allowDM: true,
  botNecessaryPermissions: [['SEND_MESSAGES']],
  description: 'Mostra a quantidade de emojis em que o bot tem acesso',
  run: async ({ message, bot }) => {
    message.channel.send(`Tenho acesso a **${bot.emojis.cache.size}** emojis`)
  },
})
