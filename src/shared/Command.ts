import { Message, PermissionString, TextChannel } from 'discord.js'
import { Bot } from './Bot'

export type CommandType = 'utility' | 'miscellany'

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
  readonly description?: string
  readonly aliases?: string[]
  readonly type?: Exclude<CommandType, 'miscellany'>
  readonly allowBot?: boolean
  readonly allowDM?: boolean
  readonly necessaryPermissions?: PermissionString[][]
  readonly botNecessaryPermissions?: PermissionString[][]
  readonly run: (data: Data) => any
}
export default class Command {
  readonly name!: string
  readonly description!: string | null
  readonly aliases!: string[]
  readonly type!: CommandType
  readonly allowBot!: boolean
  readonly allowDM!: boolean
  readonly memberNecessaryPermissions!: PermissionString[][]
  readonly botNecessaryPermissions!: PermissionString[][]
  readonly run!: (data: Data) => any

  constructor(public readonly options: CommandOptions) {
    Object.assign(this, {
      aliases: [],
      allowBot: false,
      allowDM: false,
      description: null,
      type: 'miscellany',
      memberNecessaryPermissions: [[]],
      botNecessaryPermissions: [[]],
      ...options,
    })
  }

  async start(data: StartData) {
    const isDm = data.message.channel.type === 'DM'
    const isBot = data.message.author.bot

    ;(await this.primaryValidation({ ...data, isDm, isBot })) &&
      (await this.memberPermissionsValidation({ ...data, isDm, isBot })) &&
      (await this.botPermissionsValidation({ ...data, isDm, isBot })) &&
      (await this.run({ ...data, isDm, isBot }))
  }

  async primaryValidation({ isDm, isBot }: Data) {
    if (!this.allowBot && isBot) return
    if (!this.allowDM && isDm) return

    return true
  }

  async memberPermissionsValidation({ message, isDm }: Data) {
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
      const messageContent =
        '> <:x_:905962263750537257> Você não possui as permissões necessárias para usar este comando!'

      if (channel.permissionsFor?.(message.guild!.me!)?.has('SEND_MESSAGES')) {
        message.channel.send(messageContent)
      } else {
        message.author.send(messageContent)
        message.react('905962263750537257')
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
      const messageContent =
        '> <:x_:905962263750537257> Eu não possuo as permissões necessárias para usar este comando!'

      if (channel.permissionsFor?.(message.guild!.me!)?.has('SEND_MESSAGES')) {
        message.channel.send(messageContent)
      } else {
        message.author.send(messageContent)
        message.react('905962263750537257')
      }
    }

    return havePermission
  }
}
