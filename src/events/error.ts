import Event from '../shared/Event'
import log from '../utils/log'

export default new Event('error', async (error) => {
  log.error('Um erro foi emitido pelo bot!', {
    restLogs: [`\nErro: `, error],
    discord: {
      filename: __filename,
      files: [['error.txt', error.stack || error.message]],
    },
  })
})
