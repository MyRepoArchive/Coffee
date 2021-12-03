import { connection } from '..'
import Command, { Data } from '../shared/Command'

export default class extends Command {
  constructor() {
    super({
      name: 'testdbconnection',
      aliases: [
        'testedb',
        'testdb',
        'tdb',
        'tdbc',
        'testedbconn',
        'testdbconn',
      ],
      allowDM: true,
      category: 'admin',
      description: 'Testa a conexão do banco de dados',
    })
  }

  run = async ({ message }: Data) => {
    connection.query('SELECT 1', (err, res) => {
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
  }
}
