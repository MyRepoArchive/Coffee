import Command from '../shared/Command'

export default new Command({
  name: 'botservers',
  aliases: ['serversbot', 'botguilds', 'guildsbot'],
  allowDM: true,
  botNecessaryPermissions: [['SEND_MESSAGES']],
  description: 'Mostra a quantidade de servidores em que o bot está',
  run: async ({ message, bot }) => {
    message.channel.send(
      `Tenho acesso a **${bot.guilds.cache.size}** servidores`
    )
  },
})
