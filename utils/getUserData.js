module.exports = {
  async getUserData(connection, user) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users where iduser = '${user.id}'`, (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        })
      })
    }
    let res;
    await consulta().then(result => {
      res = result[0]
    }).catch(err => {
      throw err;
    });
    return res
  },
}