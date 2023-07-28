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
  GuildChannel,
  MessagePayload,
  MessageOptions,
  Role,
  ApplicationCommandNonOptions,
  BaseApplicationCommandOptionsData,
  ApplicationCommandChannelOption,
  ApplicationCommandChoicesOption,
  ApplicationCommandOptionChoice,
} from 'discord.js'
import { env } from '../utils/env'
import { Bot } from './Bot'
// eslint-disable-next-line camelcase
import { x_, airplane_paper } from '../utils/emojis.json'

export interface Cooldown {
  /** Em milisegundos */
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

export interface ApplicationCommandUserOption
  extends BaseApplicationCommandOptionsData {
  type: 'USER'
  fetch?: boolean
  matchBy?: ('MENTION' | 'USERNAME' | 'ID' | 'NICKNAME' | 'TAG')[]
  matchIncluding?: boolean
  caseSensitive?: boolean
  onlyThisGuild?: boolean
}

export interface ApplicationCommandBooleanOption
  extends BaseApplicationCommandOptionsData {
  type: 'BOOLEAN'
  truthyAliases?: string[]
  falsyAliases?: string[]
  caseSensitive?: boolean
}

export interface ApplicationCommandMentionableOption
  extends BaseApplicationCommandOptionsData {
  type: 'MENTIONABLE'
  canBe?: (typeof User | typeof Role | typeof GuildMember)[]
}

export interface ApplicationCommandChannelOptionNew
  extends ApplicationCommandChannelOption {
  caseSensitive?: boolean
  matchIncluding?: boolean
  matchBy?: ('MENTION' | 'NAME' | 'ID')[]
  onlyThisGuild?: boolean
}

export interface ApplicationCommandRoleOption
  extends BaseApplicationCommandOptionsData {
  type: 'ROLE'
  caseSensitive?: boolean
  matchIncluding?: boolean
  matchBy?: ('MENTION' | 'NAME' | 'ID')[]
}

export interface ApplicationCommandNonOptionsNew
  extends ApplicationCommandNonOptions {
  type: Exclude<
    ApplicationCommandNonOptions['type'],
    'USER' | 'BOOLEAN' | 'MENTIONABLE' | 'ROLE'
  >
}

export interface ApplicationCommandOptionNumeralChoice
  extends ApplicationCommandOptionChoice {
  value: number
}

export interface ApplicationCommandOptionStringChoice
  extends ApplicationCommandOptionChoice {
  value: string
}

export interface ApplicationCommandResolverOption
  extends BaseApplicationCommandOptionsData {
  type: 'NUMBER' | 'INTEGER' | 'STRING'
  resolver?(value: string | number): any
}

export interface ApplicationCommandNumeralOption
  extends ApplicationCommandResolverOption,
    ApplicationCommandChoicesOption {
  type: 'NUMBER' | 'INTEGER'
  resolver?(value: number): any
}

export interface ApplicationCommandNumeralChoiceOption
  extends ApplicationCommandNumeralOption {
  type: 'NUMBER' | 'INTEGER'
  choices: ApplicationCommandOptionNumeralChoice[]
  caseSensitive?: boolean
}

export interface ApplicationCommandNumeralNonChoiceOption
  extends ApplicationCommandNumeralOption {
  type: 'NUMBER' | 'INTEGER'
  choices: undefined
}

export interface ApplicationCommandStringOption
  extends ApplicationCommandResolverOption,
    ApplicationCommandChoicesOption {
  type: 'STRING'
  resolver?(value: string): any
}

export interface ApplicationCommandStringChoiceOption
  extends ApplicationCommandStringOption {
  choices: ApplicationCommandOptionStringChoice[]
  caseSensitive?: boolean
}

export interface ApplicationCommandStringNonChoiceOption
  extends ApplicationCommandStringOption {
  choices: undefined
}

export interface ApplicationCommandChoicesOptionNew
  extends ApplicationCommandChoicesOption {
  type: 'STRING'
  choices?: ApplicationCommandOptionChoice[]
}

export type ApplicationCommandOptionNew =
  | Exclude<
      ApplicationCommandOption,
      | ApplicationCommandNonOptions
      | ApplicationCommandChannelOption
      | ApplicationCommandChoicesOption
    >
  | ApplicationCommandBooleanOption
  | ApplicationCommandUserOption
  | ApplicationCommandNonOptionsNew
  | ApplicationCommandChannelOptionNew
  | ApplicationCommandNumeralChoiceOption
  | ApplicationCommandNumeralNonChoiceOption
  | ApplicationCommandMentionableOption
  | ApplicationCommandRoleOption
  | ApplicationCommandStringChoiceOption
  | ApplicationCommandStringNonChoiceOption

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
  readonly cooldown?: Partial<Cooldown>
  readonly options?: ApplicationCommandOptionNew[]
  readonly optionsSplit?: string | RegExp | null
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
  readonly options!: ApplicationCommandOptionNew[]

  readonly optionsSplit!: string | RegExp | null
  readonly talkedRecently: Collection<
    string,
    { timestamp: number; times: number }
  > = new Collection()

  static readonly defaultTruthyAliases = [
    'true',
    't',
    '1',
    'y',
    'yes',
    'sim',
    's',
    'verdadeiro',
  ]

  static readonly defaultFalsyAliases = [
    'false',
    'f',
    '0',
    'n',
    'no',
    'nao',
    'não',
    'falso',
  ]

  run!: (data: Data) => any
  data?: Data
  formattedArgs: (
    | Channel
    | User
    | Role
    | GuildMember
    | boolean
    | string
    | number
    | undefined
  )[] = []

  constructor(options: CommandOptions) {
    Object.assign(this, {
      aliases: [],
      allowBot: false,
      allowDM: false,
      category: 'miscellany',
      memberNecessaryPermissions: [[]],
      botNecessaryPermissions: [[]],
      options: [],
      type: 'CHAT_INPUT',
      optionsSplit: / +/g,
      ...options,
      cooldown: {
        time: 0,
        uses: 1,
        ...(options.cooldown || {}),
      },
    })
  }

  async reply(payload: string | MessagePayload | MessageOptions) {
    const sendDm = () => {
      this.data!.message.author.send(payload).then(
        () => {
          this.data!.message.react(airplane_paper).catch(() => {})
        },
        () => {
          this.data!.message.react(x_).catch(() => {})
        }
      )
    }

    if (this.data!.isDm) {
      this.data!.message.author.send(payload).catch(() => {})
    } else {
      const channel = this.data!.message.channel as GuildChannel

      if (channel.permissionsFor(channel.guild.me!).has('SEND_MESSAGES')) {
        this.data!.message.channel.send(payload).catch(sendDm)
      } else sendDm()
    }
  }

  async start(data: StartData) {
    const isDm = data.message.channel.type === 'DM'
    const isBot = data.message.author.bot

    this.data = { ...data, isDm, isBot }
    ;(await this.primaryValidation({ ...data, isDm, isBot })) &&
      (await this.cooldownValidation({ ...data, isDm, isBot })) &&
      (await this.memberPermissionsValidation({ ...data, isDm, isBot })) &&
      (await this.botPermissionsValidation({ ...data, isDm, isBot })) &&
      (await this.optionsValidation({ ...data, isDm, isBot })) &&
      (await this.run({
        ...data,
        isDm,
        isBot,
      }))
  }

  async primaryValidation({ isDm, isBot }: Data) {
    if (!this.allowBot && isBot) return
    if (!this.allowDM && isDm) return

    return true
  }

  async cooldownValidation({ message }: Data) {
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
        this.reply(
          `> <:x_:${x_}> Você não pode usar este comando novamente por ${(
            (talkedUser.timestamp + this.cooldown.time - Date.now()) /
            1000
          ).toFixed(1)} segundos!`
        )

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
      this.reply('Apenas administradores do bot podem utilizar este comando!')

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

    if (!havePermission)
      this.reply(
        `> <:x_:${x_}> Você não possui as permissões necessárias para usar este comando!\n\`\`\`\n(${this.memberNecessaryPermissions
          .map((permissions) => permissions.join(' e '))
          .join('), (')})\n\`\`\``
      )

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

    if (!havePermission)
      this.reply(
        `> <:x_:${x_}> Eu não possuo as permissões necessárias para usar este comando!\n\`\`\`\n(${this.botNecessaryPermissions
          .map((permissions) => permissions.join(' e '))
          .join('), (')})\n\`\`\``
      )

    return havePermission
  }

  async optionsValidation({ message, bot, prefix, usedCommand }: Data) {
    if (!this.options) return true

    const optionsValidated = await Promise.all(
      this.options.map(async (option, index) => {
        const args =
          this.optionsSplit === null
            ? [
                message.content
                  .slice(prefix.length)
                  .trimStart()
                  .slice(usedCommand.length)
                  .trimStart(),
              ]
            : message.content
                .slice(prefix.length)
                .trimStart()
                .slice(usedCommand.length)
                .trimStart()
                .split(this.optionsSplit)
        const value = args[index]

        switch (option.type) {
          case 'BOOLEAN': {
            const truthy = option.truthyAliases || Command.defaultTruthyAliases
            const falsy = option.falsyAliases || Command.defaultFalsyAliases

            const allAliases = [...truthy, ...falsy]

            if (
              !allAliases
                .map((alias) =>
                  option.caseSensitive ? alias : alias.toLowerCase()
                )
                .includes(option.caseSensitive ? value : value.toLowerCase())
            ) {
              if (!option.required && !value) {
                this.formattedArgs[index] = undefined
                return true
              } else {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve ser:\n**Caso positivo**: ${truthy
                    .map((value) => `\`${value}\``)
                    .join(', ')}\n**Caso negativo**: ${falsy
                    .map((value) => `\`${value}\``)
                    .join(', ')}`
                )
                return false
              }
            }

            if (truthy.includes(value)) this.formattedArgs[index] = true
            else if (falsy.includes(value)) this.formattedArgs[index] = false

            return true
          }
          case 'CHANNEL': {
            if (
              (!option.matchBy || option.matchBy.includes('MENTION')) &&
              /^<#\d{17,19}>$/g.test(value)
            ) {
              const channel = message.mentions.channels.get(
                value.replace(/<#/g, '').replace(/>/g, '')
              ) as GuildChannel | undefined

              if (
                !channel ||
                (option.onlyThisGuild && channel.guildId !== message.guildId)
              ) {
                this.reply(`> <:x_:${x_}> Canal não encontrado!`)
                return false
              } else if (
                option.channelTypes &&
                !option.channelTypes.includes(channel.type)
              ) {
                this.reply(
                  `> <:x_:${x_}> O canal pode ser apenas dos tipos: \`\`\`\n${option.channelTypes.join(
                    ' ou '
                  )}\n\`\`\``
                )
                return false
              }

              this.formattedArgs[index] = channel
            } else if (
              (!option.matchBy || option.matchBy.includes('ID')) &&
              /^\d{17,19}$/g.test(value)
            ) {
              const channel = bot.channels.cache.get(value) as
                | GuildChannel
                | undefined

              if (
                !channel ||
                (option.onlyThisGuild && channel.guildId !== message.guildId)
              ) {
                this.reply(`> <:x_:${x_}> Canal não encontrado!`)
                return false
              } else if (
                option.channelTypes &&
                !option.channelTypes.includes(channel.type)
              ) {
                this.reply(
                  `> <:x_:${x_}> O canal pode ser apenas dos tipos: \`\`\`\n${option.channelTypes.join(
                    ' ou '
                  )}\n\`\`\``
                )
                return false
              }

              this.formattedArgs[index] = channel
            } else {
              if (!value && option.required) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve ser um canal!`
                )
                return false
              }
              if (!value && !option.required) {
                this.formattedArgs[index] = undefined
                return true
              }

              const channelsWithThisName = bot.channels.cache.filter(
                (channel) =>
                  channel instanceof GuildChannel &&
                  (option.caseSensitive
                    ? channel.name === value
                    : channel.name.toLowerCase() === value.toLowerCase())
              )
              const channelIncludesThisName = option.matchIncluding
                ? bot.channels.cache.filter(
                    (channel) =>
                      channel instanceof GuildChannel &&
                      (option.caseSensitive
                        ? channel.name.includes(value)
                        : channel.name
                            .toLowerCase()
                            .includes(value.toLowerCase()))
                  )
                : undefined

              if (
                (!option.matchBy || option.matchBy.includes('NAME')) &&
                !channelsWithThisName.size &&
                channelIncludesThisName?.size === 1 &&
                (!option.onlyThisGuild ||
                  (option.onlyThisGuild &&
                    (channelIncludesThisName.first() as GuildChannel)
                      .guildId === message.guildId))
              ) {
                if (
                  option.channelTypes &&
                  !option.channelTypes.includes(
                    channelIncludesThisName.first()!.type
                  )
                ) {
                  this.reply(
                    `> <:x_:${x_}> O canal pode ser apenas dos tipos: \`\`\`\n${option.channelTypes.join(
                      ' ou '
                    )}\n\`\`\``
                  )
                  return false
                }
                this.formattedArgs[index] = channelIncludesThisName.first()!
              } else if (
                (!option.matchBy || option.matchBy.includes('NAME')) &&
                channelsWithThisName.size === 1 &&
                (!option.onlyThisGuild ||
                  (option.onlyThisGuild &&
                    (channelsWithThisName.first() as GuildChannel).guildId ===
                      message.guildId))
              ) {
                if (
                  option.channelTypes &&
                  !option.channelTypes.includes(
                    channelsWithThisName.first()!.type
                  )
                ) {
                  this.reply(
                    `> <:x_:${x_}> O canal pode ser apenas dos tipos: \`\`\`\n${option.channelTypes.join(
                      ' ou '
                    )}\n\`\`\``
                  )
                  return false
                }
                this.formattedArgs[index] = channelsWithThisName.first()!
              } else if (option.matchBy && !option.matchBy.includes('NAME')) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve ser um canal!`
                )
                return false
              } else if (
                [channelsWithThisName, channelIncludesThisName].some(
                  (channels) => channels && channels.size > 1
                )
              ) {
                this.reply(
                  `> <:x_:${x_}> Foi encontrado mais de um canal com o nome **${value}**, tente marcá-lo ou usar seu ID!`
                )
                return false
              } else {
                this.reply(
                  `> <:x_:${x_}> Não foi encontrado nenhum canal com o nome **${value}**, tente marcá-lo ou usar seu ID!`
                )
                return false
              }
            }

            return true
          }
          case 'INTEGER': {
            if (option.choices) {
              if (
                !option.choices
                  .map((choice) =>
                    option.caseSensitive
                      ? choice.name
                      : choice.name.toLowerCase()
                  )
                  .includes(
                    option.caseSensitive ? value : value.toLowerCase()
                  ) &&
                !option.choices
                  .map((choice) => choice.value.toString())
                  .includes(value)
              ) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve coincidir com as seguintes opçoes (pode usar nome ou valor da opção):\n${option.choices
                    .map((choice) => `**${choice.name}**: \`${choice.value}\``)
                    .join('\n')}`
                )

                return false
              } else {
                const formattedValue =
                  option.choices.find((choice) =>
                    option.caseSensitive
                      ? choice.name === value
                      : choice.name.toLowerCase() === value.toLowerCase()
                  )?.value ?? parseInt(value)

                this.formattedArgs[index] =
                  option.resolver?.(formattedValue) ?? formattedValue

                return true
              }
            }

            if (!/^-?\d{1,15}$/g.test(value)) {
              if (option.required || value) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve ser um número inteiro!`
                )

                return false
              } else {
                this.formattedArgs[index] = undefined
                return true
              }
            }

            this.formattedArgs[index] =
              option.resolver?.(parseInt(value)) ?? parseInt(value)
            return true
          }
          case 'MENTIONABLE': {
            const member = message.mentions.members?.get(
              value.replace(/<@[&!]?/g, '').replace(/>/g, '')
            )
            const user = message.mentions.users?.get(
              value.replace(/<@[&!]?/g, '').replace(/>/g, '')
            )
            const role = message.mentions.roles?.get(
              value.replace(/<@[&!]?/g, '').replace(/>/g, '')
            )

            if (
              !/^<@[&!]?\d{17,19}>$/g.test(value) ||
              (!user && !role && !member)
            ) {
              if (option.required || value) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve ser uma menção a um usuário/membro ou cargo!`
                )

                return false
              } else {
                this.formattedArgs[index] = undefined
                return true
              }
            }

            if (option.canBe) {
              if (
                !option.canBe.some(
                  (instanceType) =>
                    member instanceof instanceType ||
                    user instanceof instanceType ||
                    role instanceof instanceType
                )
              ) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve ser uma menção a um ${option.canBe
                    .map((instanceType) => `\`${instanceType.name}\``)
                    .join(' ou ')}!`
                )

                return false
              }

              this.formattedArgs[index] = [member, user, role].find((value) =>
                option.canBe?.some(
                  (instanceType) => value instanceof instanceType
                )
              )
              return true
            }

            this.formattedArgs[index] = member || user || role
            return true
          }
          case 'NUMBER': {
            if (option.choices) {
              if (
                !option.choices
                  .map((choice) =>
                    option.caseSensitive
                      ? choice.name
                      : choice.name.toLowerCase()
                  )
                  .includes(
                    option.caseSensitive ? value : value.toLowerCase()
                  ) &&
                !option.choices
                  .map((choice) => choice.value.toString())
                  .includes(value.replace(',', '.'))
              ) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve coincidir com as seguintes opçoes (pode usar nome ou valor da opção):\n${option.choices
                    .map((choice) => `**${choice.name}**: \`${choice.value}\``)
                    .join('\n')}`
                )

                return false
              } else {
                const formattedValue =
                  option.choices.find((choice) =>
                    option.caseSensitive
                      ? choice.name === value
                      : choice.name.toLowerCase() === value.toLowerCase()
                  )?.value ?? Number(value.replace(',', '.'))

                this.formattedArgs[index] =
                  option.resolver?.(formattedValue) ?? formattedValue

                return true
              }
            }

            if (!/^-?\d{1,10}([.,]\d{1,5})?$/g.test(value)) {
              if (option.required || value) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve ser um número!`
                )

                return false
              } else {
                this.formattedArgs[index] = undefined
                return true
              }
            }

            const formattedValue = Number(value.replace(',', '.'))

            this.formattedArgs[index] =
              option.resolver?.(formattedValue) ?? formattedValue
            return true
          }
          case 'ROLE': {
            if (
              (!option.matchBy || option.matchBy.includes('MENTION')) &&
              /^<@&\d{17,19}>$/g.test(value)
            ) {
              const role = message.mentions.roles.get(
                value.replace(/<@&/g, '').replace(/>/g, '')
              )

              if (!role) {
                this.reply(`> <:x_:${x_}> Cargo não encontrado!`)
                return false
              }

              this.formattedArgs[index] = role
            } else if (
              (!option.matchBy || option.matchBy.includes('ID')) &&
              /^\d{17,19}$/g.test(value)
            ) {
              const role = message.guild?.roles.cache.get(value)

              if (!role) {
                this.reply(`> <:x_:${x_}> Cargo não encontrado!`)
                return false
              }

              this.formattedArgs[index] = role
            } else {
              if (!value && option.required) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve ser um cargo!`
                )
                return false
              }
              if (!value && !option.required) {
                this.formattedArgs[index] = undefined
                return true
              }

              const rolesWithThisName = message.guild?.roles.cache.filter(
                (role) =>
                  option.caseSensitive
                    ? role.name === value
                    : role.name.toLowerCase() === value.toLowerCase()
              )
              const roleIncludesThisName = option.matchIncluding
                ? message.guild?.roles.cache.filter((role) =>
                    option.caseSensitive
                      ? role.name.includes(value)
                      : role.name.toLowerCase().includes(value.toLowerCase())
                  )
                : undefined

              if (
                (!option.matchBy || option.matchBy.includes('NAME')) &&
                !rolesWithThisName?.size &&
                roleIncludesThisName?.size === 1
              ) {
                this.formattedArgs[index] = roleIncludesThisName.first()!
              } else if (
                (!option.matchBy || option.matchBy.includes('NAME')) &&
                rolesWithThisName?.size === 1
              ) {
                this.formattedArgs[index] = rolesWithThisName.first()!
              } else if (option.matchBy && !option.matchBy.includes('NAME')) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve ser um cargo!`
                )
                return false
              } else if (
                [rolesWithThisName, roleIncludesThisName].some(
                  (roles) => roles!.size > 1
                )
              ) {
                this.reply(
                  `> <:x_:${x_}> Foi encontrado mais de um cargo com o nome **${value}** neste servidor, tente marcá-lo ou usar seu ID!`
                )
                return false
              } else {
                this.reply(
                  `> <:x_:${x_}> Não foi encontrado nenhum cargo com o nome **${value}** neste servidor, tente marcá-lo ou usar seu ID!`
                )
                return false
              }
            }

            return true
          }
          case 'STRING': {
            if (option.choices) {
              if (
                !option.choices
                  .map((choice) =>
                    option.caseSensitive
                      ? choice.name
                      : choice.name.toLowerCase()
                  )
                  .includes(
                    option.caseSensitive ? value : value.toLowerCase()
                  ) &&
                !option.choices.map((choice) => choice.value).includes(value)
              ) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve coincidir com as seguintes opçoes (pode usar nome ou valor da opção):\n${option.choices
                    .map((choice) => `**${choice.name}**: \`${choice.value}\``)
                    .join('\n')}`
                )

                return false
              } else {
                const formattedValue =
                  option.choices.find((choice) =>
                    option.caseSensitive
                      ? choice.name === value
                      : choice.name.toLowerCase() === value.toLowerCase()
                  )?.value ?? value

                this.formattedArgs[index] =
                  option.resolver?.(formattedValue) ?? formattedValue

                return true
              }
            }
            if (!value && option.required) {
              this.reply(
                `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                  option.name
                }) é obrigatório!`
              )
              return false
            }
            if (!value && !option.required) {
              this.formattedArgs[index] = undefined
              return true
            }

            this.formattedArgs[index] = option.resolver?.(value) ?? value
            return true
          }
          case 'USER': {
            if (
              (!option.matchBy || option.matchBy.includes('MENTION')) &&
              /^<@!?\d{17,19}>$/g.test(value)
            ) {
              const user = message.mentions.users.get(
                value.replace(/<@!?/g, '').replace(/>/g, '')
              )

              if (
                !user ||
                (option.onlyThisGuild &&
                  !message.guild?.members.cache.get(user.id))
              ) {
                this.reply(`> <:x_:${x_}> Usuário não encontrado!`)
                return false
              }

              this.formattedArgs[index] = user
            } else if (
              (!option.matchBy || option.matchBy.includes('ID')) &&
              /^\d{17,19}$/g.test(value)
            ) {
              const user = option.fetch
                ? await bot.users.fetch(value)
                : bot.users.cache.get(value)

              if (
                !user ||
                (option.onlyThisGuild &&
                  !message.guild?.members.cache.get(user.id))
              ) {
                this.reply(`> <:x_:${x_}> Usuário não encontrado!`)
                return false
              }

              this.formattedArgs[index] = user
            } else {
              if (!value && option.required) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) é deve ser um usuário!`
                )
                return false
              }
              if (!value && !option.required) {
                this.formattedArgs[index] = undefined
                return true
              }

              const usersWithThisUsername =
                !option.matchBy || option.matchBy.includes('USERNAME')
                  ? bot.users.cache.filter((user) =>
                      option.caseSensitive
                        ? user.username === value
                        : user.username.toLowerCase() === value.toLowerCase()
                    )
                  : undefined
              const usersWithThisTag =
                !option.matchBy || option.matchBy.includes('TAG')
                  ? bot.users.cache.filter((user) =>
                      option.caseSensitive
                        ? user.tag === value
                        : user.tag.toLowerCase() === value.toLowerCase()
                    )
                  : undefined
              const usersWithThisNickname =
                !option.matchBy || option.matchBy.includes('NICKNAME')
                  ? message.guild?.members.cache
                      .filter((member) =>
                        option.caseSensitive
                          ? member.nickname === value
                          : member.nickname?.toLowerCase() ===
                            value.toLowerCase()
                      )
                      .mapValues((member) => member.user)
                  : undefined
              const userIncludesThisUsername =
                !option.matchBy || option.matchBy.includes('USERNAME')
                  ? option.matchIncluding
                    ? bot.users.cache.filter((user) =>
                        option.caseSensitive
                          ? user.username.includes(value)
                          : user.username
                              .toLowerCase()
                              .includes(value.toLowerCase())
                      )
                    : undefined
                  : undefined
              const userIncludesThisTag =
                !option.matchBy || option.matchBy.includes('TAG')
                  ? option.matchIncluding
                    ? bot.users.cache.filter((user) =>
                        option.caseSensitive
                          ? user.tag.includes(value)
                          : user.tag.toLowerCase().includes(value.toLowerCase())
                      )
                    : undefined
                  : undefined
              const userIncludesThisNickname =
                !option.matchBy || option.matchBy.includes('NICKNAME')
                  ? option.matchIncluding
                    ? message.guild?.members.cache
                        .filter((member) =>
                          option.caseSensitive
                            ? member.nickname?.includes(value) || false
                            : member.nickname
                                ?.toLowerCase()
                                .includes(value.toLowerCase()) || false
                        )
                        .mapValues((member) => member.user)
                    : undefined
                  : undefined

              if (
                !usersWithThisUsername?.size &&
                !usersWithThisTag?.size &&
                !usersWithThisNickname?.size &&
                !userIncludesThisUsername?.size &&
                !userIncludesThisTag?.size &&
                userIncludesThisNickname?.size === 1 &&
                (!option.onlyThisGuild ||
                  (option.onlyThisGuild &&
                    message.guild?.members.cache.get(
                      userIncludesThisNickname.first()!.id
                    )))
              ) {
                this.formattedArgs[index] = userIncludesThisNickname.first()!
              } else if (
                !usersWithThisUsername?.size &&
                !usersWithThisTag?.size &&
                !usersWithThisNickname?.size &&
                !userIncludesThisUsername?.size &&
                userIncludesThisTag?.size === 1 &&
                (!option.onlyThisGuild ||
                  (option.onlyThisGuild &&
                    message.guild?.members.cache.get(
                      userIncludesThisTag.first()!.id
                    )))
              ) {
                this.formattedArgs[index] = userIncludesThisTag.first()!
              } else if (
                !usersWithThisUsername?.size &&
                !usersWithThisTag?.size &&
                !usersWithThisNickname?.size &&
                userIncludesThisUsername?.size === 1 &&
                (!option.onlyThisGuild ||
                  (option.onlyThisGuild &&
                    message.guild?.members.cache.get(
                      userIncludesThisUsername.first()!.id
                    )))
              ) {
                this.formattedArgs[index] = userIncludesThisUsername.first()!
              } else if (
                !usersWithThisUsername?.size &&
                !usersWithThisTag?.size &&
                usersWithThisNickname?.size === 1 &&
                (!option.onlyThisGuild ||
                  (option.onlyThisGuild &&
                    message.guild?.members.cache.get(
                      usersWithThisNickname.first()!.id
                    )))
              ) {
                this.formattedArgs[index] = usersWithThisNickname.first()!
              } else if (
                !usersWithThisUsername?.size &&
                usersWithThisTag?.size === 1 &&
                (!option.onlyThisGuild ||
                  (option.onlyThisGuild &&
                    message.guild?.members.cache.get(
                      usersWithThisTag.first()!.id
                    )))
              ) {
                this.formattedArgs[index] = usersWithThisTag.first()!
              } else if (
                usersWithThisUsername?.size === 1 &&
                (!option.onlyThisGuild ||
                  (option.onlyThisGuild &&
                    message.guild?.members.cache.get(
                      usersWithThisUsername.first()!.id
                    )))
              ) {
                this.formattedArgs[index] = usersWithThisUsername.first()!
              } else if (
                option.matchBy &&
                !option.matchBy.includes('USERNAME') &&
                !option.matchBy.includes('TAG') &&
                !option.matchBy.includes('NICKNAME')
              ) {
                this.reply(
                  `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                    option.name
                  }) deve ser um canal!`
                )
                return false
              } else if (
                [
                  usersWithThisUsername,
                  usersWithThisTag,
                  usersWithThisNickname,
                  userIncludesThisUsername,
                  userIncludesThisTag,
                  userIncludesThisNickname,
                ].some((users) => users!.size > 1)
              ) {
                this.reply(
                  `> <:x_:${x_}> Foi encontrado mais de um usuário que corresponde a **${value}**, tente mencioná-lo ou usar seu ID!`
                )
                return false
              } else {
                this.reply(
                  `> <:x_:${x_}> Não foi encontrado nenhum usuário que corresponde a **${value}**, tente mencioná-lo ou usar seu ID!`
                )
                return false
              }
            }

            return true
          }
        }

        return true
      })
    )

    return optionsValidated.every((option) => option)
  }
}

export class CommandClass extends Command {
  constructor() {
    super({
      name: '',
      description: '',
    })
  }
}
