module.exports = {
  async getUserInventory(connection, user, guild) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT products.id, name, type, image_id, description, momento_compra, validade FROM compras_globais inner join products on products.id = productid where userid = '${user.id}'`, async (err, result) => {
          if (err) {
            return reject(err);
          }
          let res = {
            globalResult: result,
            types: [...new Set(result.map(x => x.type))]
            
          };
          connection.query(`Select products.id, name, type, image_id, description, momento_compra, validade from compras_locais inner join products on products.id = productid where userid = '${user.id}' and serverid = '${guild.id}'`, async (err, result) => {
            if(err) throw err
            res.localResult = result
            result.map(x => res.types.push(x.type))
            res.types = [...new Set(res.types)]
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