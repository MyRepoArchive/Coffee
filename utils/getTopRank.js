module.exports = {
  async run(connection, guild, user) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT userid, score FROM score_per_server where serverid = '${guild.id}' order by score desc`, (err, result) => {
          if (err) {
            return reject(err);
          }
          if(result[0] === undefined) {
            connection.query(`insert into score_per_server (userid, serverid) values ('${user.id}', '${guild.id}');`)
            result[0] = { userid: user.id, score: 0 }
          }
          return resolve(result);
        })
      })
    }
    let res = [];
    await consulta().then(result => {
      const users = result.map(resul => resul.userid)
      const scores = result.map(resul => resul.score)
      if(result[0] === undefined)return;
      for(let resul in users) {
        res.push([users[resul], scores[resul]])
      }
    }).catch(err => {
      throw err;
    });
    return res
  }
}