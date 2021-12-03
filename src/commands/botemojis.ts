import Command, { Data } from '../shared/Command'

export default class extends Command {
  constructor() {
    super({
      name: 'botemojis',
      aliases: ['emojisbot', 'be'],
      allowDM: true,
      botNecessaryPermissions: [['SEND_MESSAGES']],
      description: 'Mostra a quantidade de emojis em que o bot tem acesso',
    })
  }

  run = async ({ message, bot }: Data) => {
    message.channel.send(`Tenho acesso a **${bot.emojis.cache.size}** emojis`)
  }
}
