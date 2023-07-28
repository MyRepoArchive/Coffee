import { GuildMember, Role, User } from 'discord.js'
import Command, { Data } from '../shared/Command'

export default class extends Command {
  constructor() {
    super({
      name: 'teste',
      description: 'Comando para testar o bot',
      aliases: ['t'],
      allowDM: true,
      category: 'admin',
      cooldown: {
        time: 5000,
      },
      options: [
        {
          name: 'teste',
          description: 'Teste',
          type: 'MENTIONABLE',
          required: true,
        },
      ],
    })
  }

  run = async ({ message }: Data) => {
    console.log(this.formattedArgs)
    message.reply(`\`\`\`\n${`${this.formattedArgs}`.slice(0, 1900)}\n\`\`\``)
  }
}
