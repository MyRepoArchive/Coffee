let stts = 'aberto';

module.exports = {
  async intervaloVerificacao(connection, client) {
    if(!stts.includes('fechado')) {
      setInterval(() => {
        this.verificacao(connection, client)
      }, 50000);
    }
  },
  async verificacao(connection, client) {
    connection.query(`select compras_globais.id, userid, productid, momento_compra, validade, name, reducao_taxa from compras_globais inner join products on productid = products.id where products.validade > 0 order by userid`, (err, result) => {
      if(err) throw err;
      const vencidos = result.filter(x => Date.now() - x.momento_compra > x.validade)
      const naoVencidos = result.filter(x => Date.now() - x.momento_compra < x.validade)
      if(vencidos.length > 0) {
        vencidos.forEach(compra => {
          const user = client.users.cache.get(compra.userid)
          const dataCompra = new Date(compra.momento_compra).getUTCDate() + '/' + (new Date(compra.momento_compra).getUTCMonth()+1) + '/' + new Date(compra.momento_compra).getUTCFullYear()
          const dataVencimento = new Date(compra.momento_compra+compra.validade).getUTCDate() + '/' + (new Date(compra.momento_compra+compra.validade).getUTCMonth()+1) + '/' + new Date(compra.momento_compra+compra.validade).getUTCFullYear()
          user.send(`> Olá Sr.${user.username}, venho lhe informar que seu **${compra.name}** com validade para **${compra.validade/86400000} dias** venceu hoje! Ele estará sendo retirado de sua conta, caso queira renovar utilize o comando **loja** em qualquer servidor que eu estiver presente! Muito obrigado pela compreensão\n\n> Data da compra: \`${dataCompra}\`\n> Data de vencimento: \`${dataVencimento}\``).catch(() => {})
        })
        let deleteQuery = '';
        for(let i = 0; i < vencidos.length; i++) {
          if(i === vencidos.length-1) {
            deleteQuery += `id = ${vencidos[i].id}`
          } else {
            deleteQuery += `id = ${vencidos[i].id} or `
          }
        }
        let selectQuery = '';
        for(let i = 0; i < vencidos.length; i++) {
          if(i === vencidos.length-1) {
            selectQuery += `iduser = '${vencidos[i].userid}'`
          } else {
            selectQuery += `iduser = '${vencidos[i].userid}' or `
          }
        }
        connection.query(`delete from compras_globais where ${deleteQuery}`)
        connection.query(`select iduser from users where ${selectQuery} order by iduser`, (err, result) => {
          if(err) throw err;
          const usersVencidos = vencidos.map(x => x.userid)
          const attUsers = result.filter(x => usersVencidos.includes(x.iduser))
          let updateQuery = '';
          for(let i = 0; i < attUsers.length; i++) {
            const newValue = naoVencidos.filter(x => x.userid === attUsers[i].iduser).length > 0 ? eval(naoVencidos.filter(x => x.userid === attUsers[i].iduser).map(x => x.reducao_taxa).join('+')) : 0
            if(i === attUsers.length-1) {
              updateQuery += `when ${attUsers[i].iduser} then '${newValue}' end where id in (${attUsers.map(x => x.iduser).join(', ')})`
            } else {
              updateQuery += `when ${attUsers[i].iduser} then '${newValue}' `
            }
          }
          if(updateQuery) connection.query(`update users set reducao_taxa = case iduser ${updateQuery}`)
        })
      }
      
    })
    connection.query(`select compras_locais.id, userid, serverid, productid, momento_compra, validade, name, reducao_taxa from compras_locais inner join products on productid = products.id where products.validade > 0`, (err, result) => {
      if(err) throw err;
      const vencidos = result.filter(x => Date.now() - x.momento_compra > x.validade) 
      const naoVencidos = result.filter(x => Date.now() - x.momento_compra < x.validade)
      if(vencidos.length > 0) {
        vencidos.forEach(compra => {
          const user = client.users.cache.get(compra.userid)
          const guild = client.guilds.cache.get(compra.serverid)
          const dataCompra = new Date(compra.momento_compra).getUTCDate() + '/' + (new Date(compra.momento_compra).getUTCMonth()+1) + '/' + new Date(compra.momento_compra).getUTCFullYear()
          const dataVencimento = new Date(compra.momento_compra+compra.validade).getUTCDate() + '/' + (new Date(compra.momento_compra+compra.validade).getUTCMonth()+1) + '/' + new Date(compra.momento_compra+compra.validade).getUTCFullYear()
          user.send(`> Olá Sr.${user.username}, venho lhe informar que seu **${compra.name}**, comprado no servidor **${guild.name}**, com validade para **${compra.validade/86400000} dias** venceu hoje! Ele estará sendo retirado de sua conta, caso queira renovar utilize o comando **loja** em qualquer servidor que eu estiver presente! Muito obrigado pela compreensão\n\n> Data da compra: \`${dataCompra}\`\n> Data de vencimento: \`${dataVencimento}\``).catch(() => {})
        })
        let deleteQuery = '';
        for(let i = 0; i < vencidos.length; i++) {
          if(i === vencidos.length-1) {
            deleteQuery += `id = ${vencidos[i].id}`
          } else {
            deleteQuery += `id = ${vencidos[i].id} or `
          }
        }
        let selectQuery = '';
        for(let i = 0; i < vencidos.length; i++) {
          if(i === vencidos.length-1) {
            selectQuery += `userid = '${vencidos[i].userid}'`
          } else {
            selectQuery += `userid = '${vencidos[i].userid}' or `
          }
        }
        connection.query(`delete from compras_locais where ${deleteQuery}`)
        connection.query(`select userid from score_per_server where ${selectQuery} order by iduser`, (err, result) => {

        })
      }
      
    })
  }
}