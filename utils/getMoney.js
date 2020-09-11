module.exports = {
  async getMoney(connection, user) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT money, bankmoney FROM users where iduser = '${user.id}'`, (err, result) => {
          if (err) {
            return reject(err);
          }
          let res = {
            bankmoney: 0,
            money: 0
          };
          if(result[0] === undefined) {
            connection.query(`insert into users (iduser) values ('${user.id}');`, async err => {
              if (err) return console.log(err.stack)
            })
          } else {
            res.bankmoney = result[0].bankmoney
            res.money = result[0].money
          }
          return resolve(res);
        })
      })
    }
    let res;
    await consulta().then(result => {
      if(result === undefined)return;
      res = result
    }).catch(err => {
      throw err;
    });
    return res
  },
  async getServerMoney(connection, user, guild) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT money FROM score_per_server where userid = '${user.id}' and serverid = '${guild.id}'`, (err, result) => {
          if (err) {
            return reject(err);
          }
          let res = {
            money: 0
          };
          if(result[0] === undefined) {
            connection.query(`insert into score_per_server (userid, serverid) values ('${user.id}', '${guild.id}')`, async err => {
              if (err) return console.log(err.stack)
            })
          } else {
            res.money = result[0].money
          }
          return resolve(res);
        })
      })
    }
    let res;
    await consulta().then(result => {
      if(result === undefined)return;
      res = result.money
    }).catch(err => {
      throw err;
    });
    return res
  }
}