module.exports = {
  async run(connection, user) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT iduser, bankmoney FROM users order by bankmoney desc`, (err, result) => {
          if (err) {
            return reject(err);
          }
          if(result[0] === undefined) {
            connection.query(`insert into users (iduser) values ('${user.id}');`)
            result[0] = { iduser: user.id, bankmoney: 0 }
          }
          return resolve(result);
        })
      })
    }
    let res = [];
    await consulta().then(result => {
      const users = result.map(resul => resul.iduser)
      const bankmoneys = result.map(resul => resul.bankmoney)
      if(result[0] === undefined)return;
      for(let resul in users) {
        res.push([users[resul], bankmoneys[resul]])
      }
    }).catch(err => {
      throw err;
    });
    return res
  }
}