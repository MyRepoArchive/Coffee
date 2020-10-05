module.exports = {
  prefixs: {}, // Stara a variável que armazena os prefixos em cache
  async getCachePrefix(connection, message) { // Função que é chamada pelos arquivos externos
    if(this.prefixs[message.guild.id]) { // Se na variável de cache dos prefixos já existir um registro para o servidor em que foi enviado a msg, ele pega o prefixo do cache
      return this.prefixs[message.guild.id]
    } else { // Caso ainda não tenha um registro no cache, ele faz um requerimento ao database e registra no cache
      this.prefixs[message.guild.id] = await this.getPrefix(connection, message)
      return this.prefixs[message.guild.id]
    }
  },
  async getPrefix(connection, message) { // Função que pega o prefix direto do db
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