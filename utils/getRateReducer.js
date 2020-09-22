module.exports = {
  rateReduces: {},
  async getCacheRateReducer(connection, user, guild) {
    if(this.rateReduces[guild.id+'-'+user.id]) {
      return this.rateReduces[guild.id+'-'+user.id]
    } else {
      this.rateReduces[guild.id+'-'+user.id] = await this.getRateReducer(connection, user, guild)
      return this.rateReduces[guild.id+'-'+user.id]
    }
  },

  async getRateReducer(connection, user, guild) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT reducao_taxa FROM users where iduser = '${user.id}'`, (err, result) => {
          if (err) {
            return reject(err);
          }
          connection.query(`select reducao_taxa from score_per_server where userid = '${user.id}' and serverid = '${guild.id}'`, (err, resultSPS) => {
            if(err) throw err;
            const res = result[0].reducao_taxa + resultSPS[0].reducao_taxa
            return resolve(res);
          })
        })
      })
    }
    let res;
    await consulta().then(result => {
      res = result > 20 ? 20 : result
    }).catch(err => {
      throw err;
    });
    return res
  },
}