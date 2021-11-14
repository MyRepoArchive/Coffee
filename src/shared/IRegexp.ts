export interface IRegexp {
  type: 'negative' | 'positive'
  value: () => RegExp
  error: string
}
