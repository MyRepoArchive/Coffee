module.exports = {
  channelsCache: {},

  async getCacheCalc(connection, channel, guild) {
    let res = {}
    if (this.channelsCache[guild.id]) {
      if (!this.channelsCache[guild.id][channel.id] === undefined) {
        const getCalc = await this.getCalc(connection, channel, guild)
        this.channelsCache[guild.id][channel.id] = getCalc.canalAtual
        this.channelsCache[guild.id] = getCalc.calcCanais
      }
    } else {
      const getCalc = await this.getCalc(connection, channel, guild)
      this.channelsCache[guild.id] = getCalc.calcCanais
    }
    res.canaisAtivos = Object.values(this.channelsCache[guild.id]).filter(x => x === 1).length
    res.canaisInativos = Object.values(this.channelsCache[guild.id]).filter(x => x === 0).length
    res.canalAtual = this.channelsCache[guild.id][channel.id] === 1 ? true : false
    return res;
  },

  async getCalc(connection, channel, guild) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT calc, channelid FROM channels where serverid = '${guild.id}'`, (err, result) => {
          console.log('request')
          if (err) return reject(err);
          const canalDaMessage = result.find(result => result.channelid === channel.id)
          const idsChannels = result.map(result => result.channelid)
          const precisaInsertInto = guild.channels.cache.filter(canal => !idsChannels.includes(canal.id)).map(x => x.id)
          const res = {
            canaisAtivos: result.filter(result => result.calc === 1).length + precisaInsertInto.length,
            canaisInativos: result.filter(result => result.calc === 0).length,
            canalAtual: canalDaMessage ? (canalDaMessage.calc === 1 ? true : false) : true,
            calcCanais: {}
          }
          for (let i = 0; i < result.length; i++) {
            res.calcCanais[result[i].channelid] = result[i].calc
          }
          for (let i = 0; i < precisaInsertInto.length; i++) {
            res.calcCanais[precisaInsertInto[i]] = 1
          }
          if (precisaInsertInto.length > 0) {
            console.log('insert')
            let insertSql = '';
            for (let i = 0; i < precisaInsertInto.length; i++) {
              i === precisaInsertInto.length - 1 ? insertSql += `('${precisaInsertInto[i]}', '${guild.id}')` : insertSql += `('${precisaInsertInto[i]}', '${guild.id}'), `
            }
            connection.query(`insert into channels (channelid, serverid) values ${insertSql};`)
          }
          return resolve(res);
        })
      })
    }
    let res;
    await consulta().then(result => {
      res = result
    }).catch(err => {
      throw err;
    });
    return res
  }
}