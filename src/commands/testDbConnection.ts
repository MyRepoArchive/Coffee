import { pool } from '..'
import Command from '../shared/Command'

export default new Command({
  name: 'testdbconnection',
  aliases: ['testedb', 'testdb', 'tdb', 'tdbc', 'testedbconn', 'testdbconn'],
  allowDM: true,
  type: 'admin',
  run: async ({ message }) => {
    pool.query('SELECT * FROM guilds', (err, res) => {
      if (err) {
        message.author.send(`Error: ${JSON.stringify(err, null, 2)}`)
      } else {
        message.author.send({
          content: `Success!\n\`\`\`${JSON.stringify(res, null, 2).slice(
            0,
            2000
          )}\`\`\``,
        })
      }
    })
  },
})
