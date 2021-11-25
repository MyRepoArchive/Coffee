import { Client, ClientOptions, Collection, If } from 'discord.js'
import Database from '../database'
import Command from './Command'

export class Bot<Ready extends boolean = boolean> extends Client<Ready> {
  commands: Collection<string, Command>
  database: If<Ready, Database>
  readonly instanciedTime: Date = new Date()

  constructor(
    options: ClientOptions & {
      commands?: Collection<string, Command>
    },
    private readonly makeCache: boolean
  ) {
    super(options)
    this.commands = options?.commands ?? new Collection()
    this.database = null as If<Ready, Database>
  }

  async login(token: string): Promise<string> {
    const logedToken = await super.login(token)

    this.database = (await Database.init()) as If<Ready, Database>

    return logedToken
  }
}
