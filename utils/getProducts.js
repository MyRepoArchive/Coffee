module.exports = {
  async getProducts(connection) {
    const consulta = () => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT id, name, description, price, type, image_id, global_price FROM products`, (err, result) => {
          if (err) {
            return reject(err);
          }
          let res = {
            result: result,
            names: result.map(x => x.name),
            descriptions: result.map(x => x.description),
            prices: result.map(x => x.price),
            types: result.map(x => x.type),
            image_ids: result.map(x => x.image_id)
          };
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
  },
}