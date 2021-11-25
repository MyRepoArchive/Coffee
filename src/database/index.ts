import { connection } from '..'
import ChannelsController from './controllers/ChannelsController'
import GuildsController from './controllers/GuildsController'

export type DatabaseTables = 'channels' | 'guilds'

export default class Database {
  guilds!: GuildsController
  channels!: ChannelsController

  static init(): Database {
    const db = new Database()

    db.guilds = new GuildsController(connection)
    db.channels = new ChannelsController(connection)

    return db
  }
}
