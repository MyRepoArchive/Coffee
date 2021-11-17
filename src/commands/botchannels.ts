import { ChannelTypes } from 'discord.js/typings/enums'
import Command from '../shared/Command'

export default new Command({
  name: 'botchannels',
  aliases: ['channelsbots', 'bc'],
  allowDM: true,
  botNecessaryPermissions: [['SEND_MESSAGES']],
  description: 'Mostra a quantidade de canais em que o bot tem acesso',
  run: async ({ message, bot }) => {
    message.channel.send(
      `Tenho acesso a **${getChannelSize()}** canais\nDM's: **${getChannelSize(
        'DM'
      )}**\nGrupos: **${getChannelSize(
        'GROUP_DM'
      )}**\nCategorias: **${getChannelSize(
        'GUILD_CATEGORY'
      )}**\nNotícias: **${getChannelSize(
        'GUILD_NEWS'
      )}**\nThreads de notícias: **${getChannelSize(
        'GUILD_NEWS_THREAD'
      )}**\nThreads privados: **${getChannelSize(
        'GUILD_PRIVATE_THREAD'
      )}**\nThreads públicos: **${getChannelSize(
        'GUILD_PUBLIC_THREAD'
      )}**\nStages: **${getChannelSize(
        'GUILD_STAGE_VOICE'
      )}**\nLoja: **${getChannelSize(
        'GUILD_STORE'
      )}**\nTexto: **${getChannelSize('GUILD_TEXT')}**\nVoz: **${getChannelSize(
        'GUILD_VOICE'
      )}**\nDesconhecidos: **${getChannelSize('UNKNOWN')}**`
    )

    function getChannelSize(type?: keyof typeof ChannelTypes) {
      return bot.channels.cache.filter((channel) =>
        type ? channel.type === type : true
      ).size
    }
  },
})
