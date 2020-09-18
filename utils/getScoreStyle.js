module.exports = {
  async getScoreStyle(connection, user, guild) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT image_id FROM users inner join products on products.id = users.score_style_global_em_uso where iduser = '${user.id}'`, async (err, result) => {
          if (err) {
            return reject(err);
          }
          let res = {
            globalResult: result,
            image_id: result[0] === undefined ? 1 : result[0].image_id
          };
          connection.query(`Select image_id from score_per_server inner join products on products.id = score_per_server.score_style_em_uso where userid = '${user.id}' and serverid = '${guild.id}'`, async (err, result) => {
            if(err) throw err
            res.localResult = result
            if(result[0] !== undefined) res.image_id = result[0].image_id
            return resolve(res);
          })
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