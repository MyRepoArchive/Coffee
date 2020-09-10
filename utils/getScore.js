module.exports = {
  async getScore(connection, message, member) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT score, userid, serverid FROM score_per_server order by score desc`, async (err, result) => {
          if (err) return reject(err);
          if(result[0] === undefined || !result.find(x => x.userid === member.id && x.serverid === message.guild.id)) {
            return reject('erro')
          }
          const res = {}
          res.scoreInServer = result.find(x => x.userid === member.id && x.serverid === message.guild.id).score
          res.globalScore = eval(result.filter(x => x.userid === member.id).map(x => x.score).join('+'))
          function getLevel() {
            let lv = 0;
            for(let i = (2**lv)*10; i <= res.scoreInServer; i = (2**lv)*10) {
              lv++
            }
            return lv
          }
          res.level = getLevel()
          function getGlobalLevel() {
            let gl = 0;
            for(let i = (2**gl)*10; i <= res.globalScore; i = (2**gl)*10) {
              gl++
            }
            return gl
          }
          res.globalLevel = getGlobalLevel()
          res.positionInServer = result.filter(x => x.serverid === message.guild.id).map(x => x.userid).indexOf(member.id)+1
          function getGlobalPosition() {
            const scoresUsers = []
            const users = [...new Set(result.map(x => x.userid))]
            for(let i = 0; i < users.length; i++) {
              scoresUsers.push(eval(result.filter(x => x.userid === users[i] && x.userid !== member.id).map(y => y.score).join('+')))
            }
            return scoresUsers.indexOf(undefined)+1
          }
          res.globalPosition = getGlobalPosition()
          return resolve(res);
        })
      })
    }
    let result;
    await consulta().then(res => {
      if(!res)return;
      result = res
    }).catch(err => {
      result = err
    });
    return result
  },
  /* async getLevel(connection, message, member) {
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
  } */
}