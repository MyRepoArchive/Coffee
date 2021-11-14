import { IRegexp } from '../shared/IRegexp'

export const testInRegexps = (regexps: IRegexp[], valueToBeTested: string) => {
  return regexps
    .map(({ error, type, value }) => {
      if (
        type === 'positive'
          ? !value().test(valueToBeTested)
          : value().test(valueToBeTested)
      ) {
        return error
      }
      return undefined
    })
    .find((value) => value)
}
