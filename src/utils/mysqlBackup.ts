import mySqlConfig from './mySqlConfig'
import cp from 'child_process'

export default function mysqlBackup(config: typeof mySqlConfig) {
  const dump = cp.execSync(
    `mysqldump -u${config.user} ${config.database} -h${config.host} ${
      config.password ? `-p${config.password}` : ''
    }`
  )

  return dump.toString()
}
