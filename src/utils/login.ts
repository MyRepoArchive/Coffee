import { Bot } from '../shared/Bot'
import { env } from './env'
import log from './log'

export default async function login(bot: Bot<false>) {
  log.info('Logando...')
  await bot
    .login(env.TOKEN)
    .then(() => log.success('Logado com sucesso!'))
    .catch((err) =>
      log.error('Erro ao fazer login!\nErro:', { restLogs: [err] })
    )
}
