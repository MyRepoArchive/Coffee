import 'dotenv/config'

interface IEnv {
  PREFIX: string
  OWNERS: string[]
  TOKEN: string
  MAIN_LOG_CHANNEL: string
  MYSQL_USER: string
  MYSQL_PASSWORD: string
  MYSQL_HOST: string
  MYSQL_DATABASE: string
  MYSQL_PORT: number
  SYNC_CACHE_INTERVAL: number
}

export const env: IEnv = {
  PREFIX: process.env.PREFIX || '!',
  OWNERS: process.env.OWNERS ? process.env.OWNERS.split(',') : [],
  TOKEN: process.env.TOKEN || '',
  MAIN_LOG_CHANNEL: process.env.MAIN_LOG_CHANNEL || '',
  MYSQL_USER: process.env.MYSQL_USER || '',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
  MYSQL_HOST: process.env.MYSQL_HOST || '',
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || '',
  MYSQL_PORT: Number(process.env.MYSQL_PORT) || 3306,
  SYNC_CACHE_INTERVAL: Number(process.env.SYNC_CACHE_INTERVAL) || 15,
}
