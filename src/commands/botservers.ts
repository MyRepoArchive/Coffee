import Command, { Data } from '../shared/Command'

export default class extends Command {
  constructor() {
    super({
      name: 'botservers',
      aliases: ['serversbot', 'botguilds', 'guildsbot', 'bs', 'bg'],
      allowDM: true,
      botNecessaryPermissions: [['SEND_MESSAGES']],
      description: 'Mostra a quantidade de servidores em que o bot está',
    })
  }

  run = async ({ message, bot }: Data) => {
    message.channel.send(
      `Tenho acesso a **${bot.guilds.cache.size}** servidores`
    )
  }
}
