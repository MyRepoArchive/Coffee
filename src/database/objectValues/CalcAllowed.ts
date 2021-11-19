class CalcAllowedError extends Error {
  constructor(message: string, propName = 'calcAllowed') {
    super(`${propName}: ${message}`)
  }
}

export class CalcAllowed {
  private constructor(private readonly calcAllowed: boolean) {
    Object.freeze(this)
  }

  get value(): boolean {
    return this.calcAllowed
  }

  static create(calcAllowed: boolean, propName?: string): CalcAllowed {
    if (typeof calcAllowed !== 'boolean')
      throw new CalcAllowedError('Não é do tipo "boolean"', propName)

    return new CalcAllowed(calcAllowed)
  }
}
