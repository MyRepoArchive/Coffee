import { ClientEvents } from 'discord.js'
import { Bot } from './Bot'

export default class Event<
  Name extends keyof ClientEvents = keyof ClientEvents
> {
  constructor(
    public readonly name: Name,
    public readonly run: (...data: [Bot<true>, ...ClientEvents[Name]]) => any,
    public readonly type: 'on' | 'once' = 'on'
  ) {}
}
