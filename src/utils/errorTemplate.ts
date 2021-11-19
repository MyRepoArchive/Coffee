import chalk from 'chalk'
import dayjs from 'dayjs'

export default function errorTemplate() {
  return `${chalk.red.bold('✗ ERROR')} ${chalk.gray(
    dayjs().format('hh:mm:ss')
  )}:`
}
