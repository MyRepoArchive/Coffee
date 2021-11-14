import chalk from 'chalk'
import dayjs from 'dayjs'

export default function infoTemplate() {
  return `${chalk.cyan.bold('→ INFO')} ${chalk.gray(
    dayjs().format('hh:mm:ss')
  )}:`
}
