import { IRegexp } from '../../shared/IRegexp'
import { testInRegexps } from '../../utils/testInRegexps'

class PrefixError extends Error {
  constructor(message: string, propName = 'prefix') {
    super(`${propName}: ${message}`)
  }
}

export class Prefix {
  private constructor(private readonly prefix: string) {
    Object.freeze(this)
  }

  get value(): string {
    return this.prefix
  }

  static minimumLength = 1
  static maximumLength = 5
  static regexps: IRegexp[] = [
    {
      type: 'negative',
      value: () => /[\\]+/g,
      error: 'Não é permitido o uso de contra-barras',
    },
  ]

  static create(prefix: string, propName?: string): Prefix {
    if (typeof prefix !== 'string')
      throw new PrefixError('Não é do tipo "string"', propName)
    if (prefix.length < this.minimumLength)
      throw new PrefixError(
        `É menor que o tamanho mínimo de ${this.minimumLength} caracteres`,
        propName
      )
    if (prefix.length > this.maximumLength)
      throw new PrefixError(
        `É maior que o tamanho máximo de ${this.maximumLength} caracteres`,
        propName
      )

    const regexError = testInRegexps(this.regexps, prefix)

    if (regexError) throw new PrefixError(regexError, propName)

    return new Prefix(prefix)
  }
}
