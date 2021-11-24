import { connection } from '..'
import ChannelsController from './controllers/ChannelsController'
import GuildsController from './controllers/GuildsController'

export type DatabaseTables = 'channels' | 'guilds'

export default class Database {
  guilds: GuildsController
  channels: ChannelsController

  constructor() {
    this.guilds = new GuildsController(connection)
    this.channels = new ChannelsController(connection)
  }
}
