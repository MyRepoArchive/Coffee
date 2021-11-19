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
}