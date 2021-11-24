import { connection } from '..'
import log from '../utils/log'
import ChannelsController from './controllers/ChannelsController'
import GuildsController from './controllers/GuildsController'

export type DatabaseTables = 'channels' | 'guilds'

export default class Database {
  guilds!: GuildsController
  channels!: ChannelsController

  constructor() {
    connection.getConnection((err, connection) => {
      if (err)
        return log.error('Erro ao estabelecer conexão pool:', {
          restLogs: [err],
        })
      this.guilds = new GuildsController(connection)
      this.channels = new ChannelsController(connection)
    })
  }
}
