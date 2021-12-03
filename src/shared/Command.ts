import {
  Message,
  PermissionString,
  TextChannel,
  Collection,
  ApplicationCommandType,
  ApplicationCommandOption,
  Channel,
  User,
  GuildMember,
} from 'discord.js'
import { env } from '../utils/env'
import { Bot } from './Bot'
import { x_ } from '../utils/emojis.json'

export interface Cooldown {
  time: number
  uses: number
}

export type CommandCategory =
  | 'utility'
  | 'miscellany'
  | 'moderation'
  | 'admin'
  | 'configuration'

export interface StartData {
  message: Message
  bot: Bot<true>
  isGuild: boolean
  args: string[]
  usedCommand: string
  prefix: string
  isMentionPrefix: boolean
  dbPrefix: string | false | undefined
}

export interface Data extends StartData {
  isDm: boolean
  isBot: boolean
}

export interface CommandOptions {
  readonly name: string
  readonly description: string
  readonly aliases?: string[]
  readonly category?: Exclude<CommandCategory, 'miscellany'>
  readonly allowBot?: boolean
  readonly type?: ApplicationCommandType
  readonly allowDM?: boolean
  readonly memberNecessaryPermissions?: PermissionString[][]
  readonly botNecessaryPermissions?: PermissionString[][]
  readonly cooldown?: Cooldown
  readonly options?: ApplicationCommandOption[]
}
export default class Command {
  readonly name!: string
  readonly description!: string | null
  readonly aliases!: string[]
  readonly category!: CommandCategory
  readonly type!: ApplicationCommandType
  readonly allowBot!: boolean
  readonly allowDM!: boolean
  readonly memberNecessaryPermissions!: PermissionString[][]
  readonly botNecessaryPermissions!: PermissionString[][]
  readonly cooldown!: Cooldown
  readonly options?: ApplicationCommandOption[]
  readonly talkedRecently: Collection<
    string,
    { timestamp: number; times: number }
  > = new Collection()
  run!: (data: Data) => any

  formattedArgs: (Channel | User | GuildMember | boolean | string | number)[] =
    []

  constructor(options: CommandOptions) {
    Object.assign(this, {
      aliases: [],
      allowBot: false,
      allowDM: false,
      category: 'miscellany',
      memberNecessaryPermissions: [[]],
      botNecessaryPermissions: [[]],
      cooldown: {
        time: 0,
        uses: 1,
      },
      type: 'CHAT_INPUT',
      ...options,
    })
  }

  async start(data: StartData) {
    const isDm = data.message.channel.type === 'DM'
    const isBot = data.message.author.bot

    ;(await this.primaryValidation({ ...data, isDm, isBot })) &&
      (await this.cooldownValidation({ ...data, isDm, isBot })) &&
      (await this.memberPermissionsValidation({ ...data, isDm, isBot })) &&
      (await this.botPermissionsValidation({ ...data, isDm, isBot })) &&
      (await this.run({ ...data, isDm, isBot }))
  }

  async primaryValidation({ isDm, isBot }: Data) {
    if (!this.allowBot && isBot) return
    if (!this.allowDM && isDm) return

    return true
  }

  async cooldownValidation({ message, isDm }: Data) {
    const talkedUser = this.talkedRecently.get(message.author.id)

    if (!talkedUser) {
      this.talkedRecently.set(message.author.id, {
        times: 1,
        timestamp: Date.now(),
      })
      return true
    }

    if (talkedUser.timestamp + this.cooldown.time > Date.now()) {
      if (talkedUser.times >= this.cooldown.uses) {
        const messageContent = `> <:x_:${x_}> Você não pode usar este comando novamente por ${
          this.cooldown.time / 1000
        } segundos!`

        if (isDm) {
          message.author.send(messageContent)
        } else {
          message.channel.send(messageContent).catch(() => {})
        }

        return false
      } else {
        this.talkedRecently.set(message.author.id, {
          times: talkedUser.times + 1,
          timestamp: talkedUser.timestamp,
        })

        return true
      }
    } else {
      this.talkedRecently.set(message.author.id, {
        times: 1,
        timestamp: Date.now(),
      })

      return true
    }
  }

  async memberPermissionsValidation({ message, isDm }: Data) {
    if (this.category === 'admin' && !env.OWNERS.includes(message.author.id)) {
      const messageContent =
        'Apenas administradores do bot podem utilizar este comando!'

      message.channel.send(messageContent).catch(() => {
        message.author.send(messageContent)
        message.react(x_)
      })

      return false
    }

    if (isDm) return true

    const channel = message.channel as TextChannel

    const havePermission = this.memberNecessaryPermissions.some(
      (permissions) => {
        return permissions.every(
          (permission) =>
            message.member!.permissions.has(permission) &&
            (channel.permissionsFor?.(message.member!).has(permission) ?? true)
        )
      }
    )

    if (!havePermission) {
      const messageContent = `> <:x_:${x_}> Você não possui as permissões necessárias para usar este comando!\n\`\`\`\n(${this.memberNecessaryPermissions
        .map((permissions) => permissions.join(' e '))
        .join('), (')})\n\`\`\``

      if (channel.permissionsFor?.(message.guild!.me!)?.has('SEND_MESSAGES')) {
        message.channel.send(messageContent)
      } else {
        message.author.send(messageContent)
        message.react(x_)
      }
    }

    return havePermission
  }

  async botPermissionsValidation({ message, isDm }: Data) {
    if (isDm) return true

    const channel = message.channel as TextChannel

    const havePermission = this.botNecessaryPermissions.some((permissions) => {
      return permissions.every(
        (permission) =>
          message.guild!.me!.permissions.has(permission) &&
          (channel.permissionsFor?.(message.guild!.me!).has(permission) ?? true)
      )
    })

    if (!havePermission) {
      const messageContent = `> <:x_:${x_}> Eu não possuo as permissões necessárias para usar este comando!\n\`\`\`\n(${this.botNecessaryPermissions
        .map((permissions) => permissions.join(' e '))
        .join('), (')})\n\`\`\``

      if (channel.permissionsFor?.(message.guild!.me!)?.has('SEND_MESSAGES')) {
        message.channel.send(messageContent)
      } else {
        message.author.send(messageContent)
        message.react(x_)
      }
    }

    return havePermission
  }
}
