import chalk from 'chalk'
import errorTemplate from './errorTemplate'
import infoTemplate from './infoTemplate'
import successTemplate from './successTemplate'

export default {
  info: (...args: any[]) => console.info(infoTemplate(), ...args),
  success: (...args: any[]) => console.log(successTemplate(), ...args),
  error: (...args: any[]) =>
    console.log(errorTemplate(), ...args.map((arg) => chalk.red(arg))),
}
