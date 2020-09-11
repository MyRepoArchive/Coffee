const empregos = [
  ['Fazendo bico', 0.3],
  ['Jovem aprendiz', 0.6],
  ['Estagiário', 1],
  ['Ajudante de pedreiro', 1.2],
  ['Pedreiro', 1.5]
]

module.exports = {
  async daily(message, connection) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`select money from score_per_server where userid = '${message.author.id}' and serverid = '${message.guild.id}'`, async (err, result) => {
          if (err) throw err
          if (!result[0]) {
            await connection.query(`insert into score_per_server (userid, serverid) values ('${message.author.id}', '${message.guild.id}')`)
            result[0] = { money: 0 }
          }
          const money = result[0].money
          connection.query(`select daily_timestamp, consecutive_days, emprego from users where iduser = '${message.author.id}'`, async (err, result) => {
            const res = {};
            if (err) throw err
            if (!result[0]) {
              await connection.query(`insert into users (iduser) values ('${message.author.id}')`)
              result[0] = { daily_timestamp: 0, consecutive_days: 0, emprego: 0 }
            }
            const dailyTimestamp = result[0].daily_timestamp
            const diasConsecutivos = result[0].consecutive_days
            const emprego = result[0].emprego
            res.nameEmprego = empregos[emprego][0]
            const multiplicador = empregos[emprego][1]
            const multiplicadorAnterior = empregos[emprego - 1] ? empregos[emprego - 1][1] : 0
            if (message.createdTimestamp - dailyTimestamp > 86400000) {
              res.diasParaUpar = parseInt(5 * (parseInt(multiplicador) + 0.5))
              if (message.createdTimestamp - dailyTimestamp < (86400000 * 2)) {
                if (diasConsecutivos + 1 === parseInt(5 * (parseInt(multiplicador) + 0.5))) {
                  res.diasConsecutivos = 0
                  connection.query(`update users set emprego = '${emprego + 1}', consecutive_days = '0', daily_timestamp = '${message.createdTimestamp}' where iduser = '${message.author.id}'`)
                } else {
                  res.diasConsecutivos = diasConsecutivos + 1
                  connection.query(`update users set consecutive_days = '${diasConsecutivos + 1}', daily_timestamp = '${message.createdTimestamp}' where iduser = '${message.author.id}'`)
                }
              } else {
                res.diasConsecutivos = 0
                connection.query(`update users set daily_timestamp = '${message.createdTimestamp}', consecutive_days = '0' where iduser = '${message.author.id}'`)
              }
              const randomMoney = Math.round(Math.random() * (100 * multiplicador - 100 * multiplicadorAnterior) + 100 * multiplicadorAnterior)
              res.ganhoMin = 100 * multiplicadorAnterior
              res.ganhoMax = 100 * multiplicador
              res.recebido = randomMoney
              await connection.query(`update score_per_server set money = '${money + randomMoney}' where serverid = '${message.guild.id}' and userid = '${message.author.id}'`)
            } else {
              res.tempoRestante = 86400000 - (message.createdTimestamp - dailyTimestamp)
            }
            return resolve(res)
          })
        })

      })
    }
    let res;
    await consulta().then(result => {
      if (result.nameEmprego === undefined) return;
      res = result
    }).catch(err => {
      throw err
    });
    return res;
  }
}