import 'dotenv/config'

interface IEnv {
  PREFIX: string
  OWNERS: string[]
  TOKEN: string
  MAIN_LOG_CHANNEL: string
  REPORT_CHANNEL: string
  SUGGESTIONS_CHANNEL: string
  COMMANDS_URL: string
  REPOSITORY_URL: string
  MYSQL_USER: string
  MYSQL_PASSWORD: string
  MYSQL_HOST: string
  MYSQL_DATABASE: string
  MYSQL_PORT: number
}

export const env: IEnv = {
  PREFIX: process.env.PREFIX || '!',
  OWNERS: process.env.OWNERS ? process.env.OWNERS.split(',') : [],
  TOKEN: process.env.TOKEN || '',
  MAIN_LOG_CHANNEL: process.env.MAIN_LOG_CHANNEL || '',
  REPORT_CHANNEL: process.env.REPORT_CHANNEL || '',
  SUGGESTIONS_CHANNEL: process.env.SUGGESTIONS_CHANNEL || '',
  COMMANDS_URL: process.env.COMMANDS_URL || '',
  REPOSITORY_URL: process.env.REPOSITORY_URL || '',
  MYSQL_USER: process.env.MYSQL_USER || '',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
  MYSQL_HOST: process.env.MYSQL_HOST || '',
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || '',
  MYSQL_PORT: Number(process.env.MYSQL_PORT) || 3306,
}
