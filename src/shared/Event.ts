import { ClientEvents } from 'discord.js'
export default class Event<
  Name extends keyof ClientEvents = keyof ClientEvents
> {
  constructor(
    public readonly name: Name,
    public readonly run: (...data: ClientEvents[Name]) => any,
    public readonly type: 'on' | 'once' = 'on'
  ) {}
}
