import { Bot } from '../shared/Bot'
import GuildsController from './controllers/GuildsController'

export default class Database {
  guilds: GuildsController

  constructor() {
    this.guilds = new GuildsController()
  }

  static async init(bot: Bot, makeCache?: boolean) {
    const database = new Database()

    if (makeCache) {
      await database.guilds.makeCache(bot)
    }

    return database
  }
}
