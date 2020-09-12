module.exports = {
  async getUserData(connection, user) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users where iduser = '${user.id}'`, (err, result) => {
          if (err) {
            return reject(err);
          }
          connection.query(`select serverid, money, score from score_per_server where userid = '${user.id}'`, (err, resultSPS) => {
            if (err) throw err
            result.push(resultSPS)
            return resolve(result);
          })
        })
      })
    }
    let res = '';
    await consulta().then(result => {
      res = result
    }).catch(err => {
      throw err;
    });
    return res
  },
}