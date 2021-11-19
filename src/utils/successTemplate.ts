import chalk from 'chalk'
import dayjs from 'dayjs'

export default function successTemplate() {
  return `${chalk.greenBright.bold('✓ SUCCESS')} ${chalk.gray(
    dayjs().format('hh:mm:ss')
  )}:`
}
