import dayjs from 'dayjs'
import setHandlers from './config/handlers'
import { Bot } from './shared/Bot'
import login from './utils/login'
import mysql from 'mysql'
import mySqlConfig from './utils/mySqlConfig'
import log from './utils/log'

export let connection: mysql.Connection

function handleConnection() {
  log.info('Conectando ao banco de dados...')
  connection = mysql.createConnection(mySqlConfig)

  connection.connect((err) => {
    if (err) log.error(`Erro ao conectar com banco de dados: `, err)
    else log.info('Conectado ao banco de dados')
  })

  setInterval(() => {
    connection.query('SELECT 1')
  }, 50000)

  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      log.error('Conexão com banco de dados perdida. Reconectando...')
      handleConnection()
    } else log.error('Erro no banco de dados: ', err)
  })
}

handleConnection()

export const bot = new Bot(
  {
    intents: [
      'GUILDS',
      'DIRECT_MESSAGES',
      'GUILD_MESSAGES',
      'GUILD_BANS',
      'GUILD_MESSAGE_REACTIONS',
      'GUILD_MESSAGE_TYPING',
      'GUILD_PRESENCES',
      'GUILD_VOICE_STATES',
      'DIRECT_MESSAGE_REACTIONS',
      'DIRECT_MESSAGE_TYPING',
      'GUILD_EMOJIS_AND_STICKERS',
      'GUILD_INTEGRATIONS',
      'GUILD_INVITES',
      'GUILD_MEMBERS',
      'GUILD_WEBHOOKS',
    ],
  },
  true
)

dayjs.locale('pt-br')

setHandlers(bot)

login(bot)

/* export const logs: string[] = []

function hookStream(
  _stream:
    | (NodeJS.WriteStream & { fd: 1 })
    | (NodeJS.WriteStream & { fd: 2 })
    | (NodeJS.ReadStream & { fd: 0 }),
  fn: {
    (string: any): void
    (string: any): void
    (string: any): void
    (arg0: any): void
  }
) {
  const oldWrite = _stream.write
  _stream.write = (...params: any[]) => {
    fn(params)
    return oldWrite.apply(_stream, params as any)
  }

  return function () {
    _stream.write = oldWrite
  }
}

hookStream(process.stdout, function (string: any) {
  logs.push(string[0])
})
hookStream(process.stderr, function (string: any) {
  logs.push(string[0])
})
hookStream(process.stdin, function (string: any) {
  logs.push(string[0])
}) */
