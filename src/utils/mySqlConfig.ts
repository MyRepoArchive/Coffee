import { env } from './env'

export default {
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  port: env.MYSQL_PORT,
}
