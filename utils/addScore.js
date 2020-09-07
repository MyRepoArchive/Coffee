module.exports = {
  async addScore(message, connection, user) {
    connection.query(`select score from score_per_server where userid = '${user.id}' and serverid = '${message.guild.id}'`, async (err, result) => {
      if(err) throw err
      if(!result[0]) {
        await connection.query(`insert into score_per_server (serverid, userid) values ('${message.guild.id}', '${message.author.id}')`)
        await this.addScore(message, connection, user)
        return;
      } else {
        const score = result[0].score
        connection.query(`select level from score_per_server where userid = '${user.id}' and serverid = '${message.guild.id}'`, async (err, result) => {
          if(err) throw err
          const level = result[0].level
          if(score+1 === (2**level)*10) {
            connection.query(`update score_per_server set score = '0', level = '${level+1}' where userid = '${user.id}' and serverid = '${message.guild.id}'`)
          } else {
            connection.query(`update score_per_server set score = '${score+1}' where userid = '${user.id}' and serverid = '${message.guild.id}'`)
          }
        })
      }
    })
  }
}