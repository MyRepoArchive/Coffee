let scores = require('../tempScores.json');
let stts = 'aberto';

module.exports = {
  async addScore(message, connection, user) {
    scores[message.guild.id + '-' + user.id] !== undefined ? scores[message.guild.id + '-' + user.id] += 1 : scores[message.guild.id + '-' + user.id] = 1
    if(!stts.includes('fechado')) {
      setInterval(() => {
        this.saveScore(connection, Object.keys(scores), Object.values(scores))
      }, 50000)
      stts += 'fechado'
    }
  },
  async saveScore(connection, keysScores, valuesScores) {
    connection.query(`select id, serverid, userid, score, level from score_per_server order by serverid, userid`, async (err, result) => {
      if (err) throw err
      const serverUserId = result.map(x => x.serverid+'-'+x.userid)
      const precisaInsertIntoSU = keysScores.filter(x => !serverUserId.includes(x))
      const precisaInsertIntoSUS = precisaInsertIntoSU.map(x => x+'-'+valuesScores[precisaInsertIntoSU.indexOf(x)])
      let insertSql = '';
      for(let i = 0; i < precisaInsertIntoSUS.length; i++) {
        const server = precisaInsertIntoSUS[i].split('-')[0]
        const user = precisaInsertIntoSUS[i].split('-')[1]
        const pontos = precisaInsertIntoSUS[i].split('-')[2]
        if(i === precisaInsertIntoSUS.length-1) {
          insertSql += `('${server}', '${user}', '${pontos}')`
        } else {
          insertSql += `('${server}', '${user}', '${pontos}'), `
        }
      }
      if(insertSql) {
        await connection.query(`insert into score_per_server (serverid, userid, score) values ${insertSql}`)
        scores = {}
        return;
      }
      let keysValuesScores = []
      for(let i = 0; i < keysScores.length; i++) {
        keysValuesScores.push(keysScores[i]+'-'+valuesScores[i])
      }
      keysValuesScores = keysValuesScores.sort()
      const ids = result.filter(x => keysScores.includes(x.serverid+'-'+x.userid)).map(x => x.id)
      const score = result.filter(x => keysScores.includes(x.serverid+'-'+x.userid)).map(x => x.score)
      let updateSql = ''
      for(let i = 0; i < ids.length; i++) {
        const newScore = score[i]+(Number(keysValuesScores[i].split('-')[2])*3)
        if(i === ids.length-1) {
          updateSql += `when ${ids[i]} then '${newScore}' end where id in (${ids.join(', ')})`
        } else {
          updateSql += `when ${ids[i]} then '${newScore}' `
        }
      }
      /* if (score + 5 >= (2 ** level) * 10) { */
      if(updateSql) {
        await connection.query(`update score_per_server set score = case id ${updateSql}`)
        scores = {}
      }
    })
  }
  /* async saveScore(message, connection, user) {
    connection.query(`select score from score_per_server where userid = '${user.id}' and serverid = '${message.guild.id}'`, async (err, result) => {
      if(err) throw err
      if(!result[0]) {
        await connection.query(`insert into score_per_server (serverid, userid) values ('${message.guild.id}', '${user.id}')`)
        await this.saveScore(message, connection, user)
        return;
      } else {
        const score = result[0].score
        connection.query(`select level from score_per_server where userid = '${user.id}' and serverid = '${message.guild.id}'`, async (err, result) => {
          if(err) throw err
          const level = result[0].level
          if(score+5 >= (2**level)*10) {
            connection.query(`update score_per_server set score = '0', level = '${level+1}' where userid = '${user.id}' and serverid = '${message.guild.id}'`)
          } else {
            connection.query(`update score_per_server set score = '${score+5}' where userid = '${user.id}' and serverid = '${message.guild.id}'`)
          }
        })
      }
    })
  } */
}