module.exports = {
  async getPrefix(connection, message) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT prefix FROM servers where serverid = '${message.guild.id}'`, (err, result) => {
          if (err) {
            return reject(err);
          }
          if(result[0] === undefined) {
            connection.query(`insert into servers (serverid) values ('${message.guild.id}');`, err => {
              if (err) return console.log(err.stack)
              this.getPrefix(connection, message);
            })
            return;
          }
          return resolve(result);
        })
      })
    }
    let res;
    await consulta().then(result => {
      if(result[0] === undefined)return;
      res = result[0].prefix
    }).catch(err => {
      throw err;
    });
    return res
  }
}