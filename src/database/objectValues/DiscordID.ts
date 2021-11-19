import { IRegexp } from '../../shared/IRegexp'
import { testInRegexps } from '../../utils/testInRegexps'

class DiscordIDError extends Error {
  constructor(message: string, propName = 'discordID') {
    super(`${propName}: ${message}`)
  }
}

export class DiscordID {
  private constructor(private readonly discordID: string) {
    Object.freeze(this)
  }

  get value(): string {
    return this.discordID
  }

  static minimumLength = 17
  static maximumLength = 19
  static regexps: IRegexp[] = [
    {
      type: 'positive',
      value: () => /^\d+$/g,
      error: 'É formado por caracteres não numéricos',
    },
  ]

  static create(discordID: string, propName?: string): DiscordID {
    if (typeof discordID !== 'string')
      throw new DiscordIDError('Não é do tipo "string"', propName)
    if (discordID.length < this.minimumLength)
      throw new DiscordIDError(
        `É menor que o tamanho mínimo de ${this.minimumLength} caracteres`,
        propName
      )
    if (discordID.length > this.maximumLength)
      throw new DiscordIDError(
        `É maior que o tamanho máximo de ${this.maximumLength} caracteres`,
        propName
      )

    const regexError = testInRegexps(this.regexps, discordID)

    if (regexError) throw new DiscordIDError(regexError, propName)

    return new DiscordID(discordID)
  }
}
