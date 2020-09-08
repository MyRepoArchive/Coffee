module.exports = {
  async getScore(connection, message, member) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT score FROM score_per_server where userid = '${member.id}' and serverid = '${message.guild.id}'`, async (err, result) => {
          if (err) {
            return reject(err);
          }
          if(result[0] === undefined) {
            await require('./addScore.js').addScore(message, connection, member.user)
            this.getScore(connection, message, member)
            return;
          }
          return resolve(result);
        })
      })
    }
    let res;
    await consulta().then(result => {
      if(result[0] === undefined)return;
      res = result[0].score
    }).catch(err => {
      throw err;
    });
    return res
  },
  async getLevel(connection, message, member) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT level FROM score_per_server where userid = '${member.id}' and serverid = '${message.guild.id}'`, async (err, result) => {
          if (err) {
            return reject(err);
          }
          if(result[0] === undefined) {
            await require('./addScore.js').addScore(message, connection, member.user)
            this.getLevel(connection, message, member)
            return;
          }
          return resolve(result);
        })
      })
    }
    let res;
    await consulta().then(result => {
      if(result[0] === undefined)return;
      res = result[0].level
    }).catch(err => {
      throw err;
    });
    return res
  },
  async getGlobalLevel(connection, member, message) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT level FROM score_per_server where userid = '${member.id}'`, async (err, result) => {
          if (err) {
            return reject(err);
          }
          if(result[0] === undefined) {
            await require('./addScore.js').addScore(message, connection, member.user)
            this.getGlobalLevel(connection, member)
            return;
          }
          return resolve(result);
        })
      })
    }
    let res = 0;
    let globalLevel = 0;
    await consulta().then(result => {
      if(result[0] === undefined)return;
      for(let i = 0; i < result.length; i++) {
        let algo = 0;
        for(let c = 0; c < result[i].level; c++) {
          algo += (2**(result[i].level-c))*10
        }
        res += algo/2
      }
      while(res > 0) {
        res -= (2**globalLevel)*10
        globalLevel ++
      }
    }).catch(err => {
      throw err;
    });
    return globalLevel
  },
  async getUserPosition(connection, member, message) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT userid FROM score_per_server where serverid = '${message.guild.id}' order by level desc, score desc`, async (err, result) => {
          if (err) {
            return reject(err);
          }
          if(result[0] === undefined) {
            await require('./addScore.js').addScore(message, connection, member.user)
            this.getUserPosition(connection, member, message)
            return;
          }
          result = result.map(result => result.userid)
          return resolve(result);
        })
      })
    }
    let position = 0;
    await consulta().then(result => {
      if(result[0] === undefined)return;
      position = result.indexOf(member.user.id)+1
    }).catch(err => {
      throw err;
    });
    return position
  }
}