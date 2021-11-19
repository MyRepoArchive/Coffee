import { Bot } from '../shared/Bot'

let interval: NodeJS.Timer | undefined

export default async function changeActivity(bot: Bot) {
  let activityId = 0
  if (interval) clearInterval(interval)

  interval = setInterval(() => {
    // É iniciado o interval
    switch (
      activityId // Para cada activityId é executado um setActivity() diferente e adicionado +1 no activityId
    ) {
      case 0:
        bot.user?.setActivity(`Estou em ${bot.guilds.cache.size} servidores`, {
          type: 'STREAMING',
          url: 'https://github.com/joaoscoelho/Coffee',
        })
        activityId = 1
        break
      case 1:
        bot.user?.setActivity(`Temos ${bot.users.cache.size} usuários`, {
          type: 'STREAMING',
          url: 'https://github.com/joaoscoelho/Coffee',
        })
        activityId = 2
        break
      case 2:
        bot.user?.setActivity(
          `Estou a ${(
            (Date.now() - bot.instanciedTime.getTime()) /
            60000
          ).toFixed(0)}m ativo`,
          { type: 'STREAMING', url: 'https://github.com/joaoscoelho/Coffee' }
        )
        activityId = 3
        break
      default:
        bot.user?.setActivity(`Estou em ${bot.guilds.cache.size} servidores`, {
          type: 'STREAMING',
          url: 'https://github.com/joaoscoelho/Coffee',
        })
        activityId = 0
    }
  }, 40000) // 40s
}
