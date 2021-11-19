import { Bot } from '../shared/Bot'
import ChannelsController from './controllers/ChannelsController'
import GuildsController from './controllers/GuildsController'

export default class Database {
  guilds: GuildsController
  channels: ChannelsController

  constructor() {
    this.guilds = new GuildsController()
    this.channels = new ChannelsController()
  }

  static async init(bot: Bot, makeCache?: boolean) {
    const database = new Database()

    if (makeCache) {
      await database.guilds.makeCache(bot)
      await database.channels.makeCache(bot)
    }

    return database
  }
}
