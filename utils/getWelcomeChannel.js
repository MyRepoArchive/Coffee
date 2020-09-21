module.exports = {
  welcomeChannels: {},
  async getCacheWelcomeChannel(client, member, connection) {
    if(this.welcomeChannels[member.guild.id]) {
      return this.welcomeChannels[member.guild.id]
    } else {
      this.welcomeChannels[member.guild.id] = await this.getWelcomeChannel(client, member, connection)
      return this.welcomeChannels[member.guild.id]
    }
  },
  
  async getWelcomeChannel(client, member, connection) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`select welcome_channel, welcome_color_embed, welcome_title_embed, welcome_thumbnail_embed, welcome_description_embed, welcome_footer_embed from servers where serverid = '${member.guild.id}'`, (err, result) => {
          if (err) {
            return reject(err);
          }
          let res = {
            welcome_channel: null,
          };
          if(result[0] === undefined) {
            connection.query(`insert into servers (serverid) values ('${member.guild.id}');`, async err => {
              if (err) return console.log(err.stack)
            })
          } else {
            res.welcome_channel = result[0].welcome_channel
            res.welcome_color_embed = result[0].welcome_color_embed
            res.welcome_title_embed = result[0].welcome_title_embed
            res.welcome_thumbnail_embed = result[0].welcome_thumbnail_embed
            res.welcome_description_embed = result[0].welcome_description_embed
            res.welcome_footer_embed = result[0].welcome_footer_embed
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
}