import { TextChannel } from 'discord.js'
import Command from '../shared/Command'
import { x_ } from '../utils/emojis.json'

export default new Command({
  name: 'clear',
  aliases: [
    'clean',
    'limpar',
    'limpe',
    'clearchannel',
    'clearmessages',
    'clearmensagens',
    'cleanchannel',
    'cleanmessages',
    'deletarmensagens',
  ],
  category: 'moderation',
  botNecessaryPermissions: [['MANAGE_MESSAGES']],
  description:
    'O comando clean é usado para limpar até 100 mensagens de um canal (apenas mensagens com menos de 2 semanas de enviadas)',
  memberNecessaryPermissions: [['MANAGE_MESSAGES']],
  run: async ({ message, args }) => {
    const thisChannel = message.channel as TextChannel

    if (!args[0]) {
      const qtdToDeleteMessage = await thisChannel.send(
        'Digite a quantidade de mensagens a serem deletadas! (De 2 a 100)'
      )

      await qtdToDeleteMessage.react(x_)

      const cancelCollector = qtdToDeleteMessage.createReactionCollector({
        filter: (reaction, user) =>
          reaction.me && user.id === message.author.id,
        maxUsers: 1,
        time: 60000,
        max: 1,
      })

      const qtdToDeleteCollector = thisChannel.createMessageCollector({
        filter: (msg) => msg.author.id === message.author.id,
        time: 60000,
        idle: 30000,
      })

      cancelCollector.on('end', async (_coll, reason) => {
        if (reason === 'time' || reason === 'limit') {
          qtdToDeleteMessage.edit('Comando cancelado').catch(() => {})
          qtdToDeleteCollector.stop()
        }
      })

      qtdToDeleteCollector.on('collect', (msg) => {
        const qtdToDelete = Number(msg.content)

        if (isNaN(qtdToDelete) || qtdToDelete > 100 || qtdToDelete < 2) {
          qtdToDeleteMessage.edit('Digite um número de 2 a 100!')
          return
        }

        thisChannel.bulkDelete(qtdToDelete, true).then((msgs) => {
          if (qtdToDelete - msgs.size > 0)
            thisChannel.send(
              `${
                qtdToDelete - msgs.size
              } mensagens não foram deletadas pois tinham mais de duas semanas!`
            )
        })
      })
      return
    }

    const qtd = Number(args[0])

    if (isNaN(qtd) || qtd > 100 || qtd < 2)
      return thisChannel.send('Digite um número de 2 a 100!')
    thisChannel.bulkDelete(qtd, true).then((msgs) => {
      if (qtd - msgs.size > 0)
        thisChannel.send(
          `${
            qtd - msgs.size
          } mensagens não foram deletadas pois tinham mais de duas semanas!`
        )
    })
  },
})
