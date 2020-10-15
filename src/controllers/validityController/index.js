const { comprasJoinProducts, error } = require('../../functions');
const { client } = require('../..');
const moment = require('moment');
const { static: { emoji } } = require('../../utils/emojis.json');
const { notFoundUser } = require('./src/warnings');

let stts = true;

async function verificationValidity() {
  const { locais, globais } = await comprasJoinProducts();
  const vencimentosLocais = locais.filter(compra => compra.p_validade && Date.now() - compra.momento_compra > compra.p_validade);
  const vencimentosGlobais = globais.filter(compra => compra.p_validade && Date.now() - compra.momento_compra > compra.p_validade);

  if (vencimentosLocais.length > 0 || vencimentosGlobais.length > 0) {
    notify(vencimentosLocais, vencimentosGlobais);
  };
};

function notify(locais = [], globais = []) {
  locais.forEach(compra => {
    const user = client.users.cache.get(compra.user_id);
    const server = client.guilds.cache.get(compra.server_id);
    const purchaseDate = moment(compra.timestamp).locale('pt-br').format('L');
    const expirationDate = moment(compra.timestamp + compra.p_validity).locale('pt-br').format('L');

    if (!user) return notFoundUser(compra);

    if (!server) return error(
      `> ${emoji.emojicoffeeinfo} Aviso\n\n`+
      '> Houve um problema no momento de notificar um dos usuários sobre o vencimento de um de seus produtos. O Servidor no qual o usuário comprou o item não foi encontrado!\n'+
      `> O ID do usuário: "${compra.user_id}"\n`+
      `> O ID do servidor: "${compra.server_id}"\n`+
      `> O produto: ${compra.p_name} \`${compra.p_id}\``
    );

    try {
      user.send(
        `> ${emoji.emojicoffeeinfo} Aviso\n\n`+
        `> Olá Sr.${user.username}, informamos que seu **${compra.p_name}** com validade para **${compra.p_validity / 86400000} dias**, comprado no servidor ${server.name} venceu. Ele estará sendo retirado de sua conta neste instante.\n`+
        '> Agradeçemos a compreensão.\n\n'+
        `> Data da compra: \`${purchaseDate}\`\n`+
        `> Data de vencimento: \`${expirationDate}\``
      );
    } catch (e) {
      error(
        `> ${emoji.emojicoffeeinfo} Aviso\n\n`+
        '> Aconteceu um problema ao enviar a notificação de vencimento de produto para um dos usuários.\n'+
        `> O ID do usuário: "${compra.user_id}"\n`+
        `> O produto: ${compra.p_name} \`${compra.p_id}\`\n`+
        `> O erro: "${e}"`
      );
    }
  });

  globais.forEach(compra => {
    const user = client.users.cache.get(compra.user_id);
    const purchaseDate = moment(compra.timestamp).locale('pt-br').format('L');
    const expirationDate = moment(compra.timestamp + compra.p_validity).locale('pt-br').format('L');

    if (!user) return error(
      `> ${emoji.emojicoffeeinfo} Aviso\n\n`
      
    )
  });
};

module.exports = () => {
  if (stts) {
    setInterval(() => {
      verificationValidity();
    }, 50000);
    stts = false;
  };
};

async function verificacao(connection, client) {
  connection.query(`select compras_globais.id, userid, productid, momento_compra, validade, name, reducao_taxa from compras_globais inner join products on productid = products.id where products.validade > 0 order by userid`, (err, result) => {
    if (err) throw err;
    const vencidos = result.filter(x => Date.now() - x.momento_compra > x.validade)
    const naoVencidos = result.filter(x => Date.now() - x.momento_compra < x.validade)
    if (vencidos.length > 0) {
      vencidos.forEach(compra => {
        const user = client.users.cache.get(compra.userid)
        const dataCompra = new Date(compra.momento_compra).getUTCDate() + '/' + (new Date(compra.momento_compra).getUTCMonth() + 1) + '/' + new Date(compra.momento_compra).getUTCFullYear()
        const dataVencimento = new Date(compra.momento_compra + compra.validade).getUTCDate() + '/' + (new Date(compra.momento_compra + compra.validade).getUTCMonth() + 1) + '/' + new Date(compra.momento_compra + compra.validade).getUTCFullYear()
        user.send().catch(() => { })
      });
      let deleteQuery = '';
      for (let i = 0; i < vencidos.length; i++) {
        if (i === vencidos.length - 1) {
          deleteQuery += `id = ${vencidos[i].id}`
        } else {
          deleteQuery += `id = ${vencidos[i].id} or `
        }
      }
      let selectQuery = '';
      for (let i = 0; i < vencidos.length; i++) {
        if (i === vencidos.length - 1) {
          selectQuery += `iduser = '${vencidos[i].userid}'`
        } else {
          selectQuery += `iduser = '${vencidos[i].userid}' or `
        }
      }
      connection.query(`delete from compras_globais where ${deleteQuery}`)
      connection.query(`select iduser from users where ${selectQuery} order by iduser`, (err, result) => {
        if (err) throw err;
        const usersVencidos = vencidos.map(x => x.userid)
        const attUsers = result.filter(x => usersVencidos.includes(x.iduser))
        let updateQuery = '';
        for (let i = 0; i < attUsers.length; i++) {
          const newValue = naoVencidos.filter(x => x.userid === attUsers[i].iduser).length > 0 ? eval(naoVencidos.filter(x => x.userid === attUsers[i].iduser).map(x => x.reducao_taxa).join('+')) : 0
          if (i === attUsers.length - 1) {
            updateQuery += `when ${attUsers[i].iduser} then '${newValue}' end where iduser in (${attUsers.map(x => x.iduser).join(', ')})`
          } else {
            updateQuery += `when ${attUsers[i].iduser} then '${newValue}' `
          }
          const keysRateReduces = Object.keys(rateReduces).filter(key => key.split('-')[1] === attUsers[i].iduser)
          for (let i = 0; i < keysRateReduces.length; i++) {
            delete rateReduces[keysRateReduces[i]]
          }
        }
        if (updateQuery) connection.query(`update users set reducao_taxa = case iduser ${updateQuery}`)
      })
    }

  })
  connection.query(`select compras_locais.id, userid, serverid, productid, momento_compra, validade, name, reducao_taxa from compras_locais inner join products on productid = products.id where products.validade > 0`, (err, result) => {
    if (err) throw err;
    const vencidos = result.filter(x => Date.now() - x.momento_compra > x.validade)
    const naoVencidos = result.filter(x => Date.now() - x.momento_compra < x.validade)
    if (vencidos.length > 0) {
      vencidos.forEach(compra => {
        const user = client.users.cache.get(compra.userid)
        const guild = client.guilds.cache.get(compra.serverid)
        const dataCompra = new Date(compra.momento_compra).getUTCDate() + '/' + (new Date(compra.momento_compra).getUTCMonth() + 1) + '/' + new Date(compra.momento_compra).getUTCFullYear()
        const dataVencimento = new Date(compra.momento_compra + compra.validade).getUTCDate() + '/' + (new Date(compra.momento_compra + compra.validade).getUTCMonth() + 1) + '/' + new Date(compra.momento_compra + compra.validade).getUTCFullYear()
        user.send(`> Olá Sr.${user.username}, venho lhe informar que seu **${compra.name}**, comprado no servidor **${guild.name}**, com validade para **${compra.validade / 86400000} dias** venceu hoje! Ele estará sendo retirado de sua conta, caso queira renovar utilize o comando **loja** em qualquer servidor que eu estiver presente! Muito obrigado pela compreensão\n\n> Data da compra: \`${dataCompra}\`\n> Data de vencimento: \`${dataVencimento}\``).catch(() => { })
      })
      let deleteQuery = '';
      for (let i = 0; i < vencidos.length; i++) {
        if (i === vencidos.length - 1) {
          deleteQuery += `id = ${vencidos[i].id}`
        } else {
          deleteQuery += `id = ${vencidos[i].id} or `
        }
      }
      let selectQuery = '';
      for (let i = 0; i < vencidos.length; i++) {
        if (i === vencidos.length - 1) {
          selectQuery += `userid = '${vencidos[i].userid}'`
        } else {
          selectQuery += `userid = '${vencidos[i].userid}' or `
        }
      }
      connection.query(`delete from compras_locais where ${deleteQuery}`)
      connection.query(`select id, userid, serverid from score_per_server where ${selectQuery} order by userid`, (err, result) => {
        if (err) throw err;
        const usersVencidos = vencidos.map(x => x.serverid + '-' + x.userid)
        const attUsers = result.filter(x => usersVencidos.includes(x.serverid + '-' + x.userid))
        let updateQuery = '';
        for (let i = 0; i < attUsers.length; i++) {
          const newValue = naoVencidos.filter(x => x.userid === attUsers[i].userid && x.serverid === attUsers[i].serverid).length > 0 ? eval(naoVencidos.filter(x => x.userid === attUsers[i].userid && x.serverid === attUsers[i].serverid).map(x => x.reducao_taxa).join('+')) : 0
          if (i === attUsers.length - 1) {
            updateQuery += `when ${attUsers[i].id} then '${newValue}' end where id in (${attUsers.map(x => x.id).join(', ')})`
          } else {
            updateQuery += `when ${attUsers[i].id} then '${newValue}' `
          }

          if (rateReduces[attUsers[i].serverid + '-' + attUsers[i].userid] !== undefined) delete rateReduces[attUsers[i].serverid + '-' + attUsers[i].userid]
        }
        if (updateQuery) {
          connection.query(`update score_per_server set reducao_taxa = case id ${updateQuery}`);

        }
      })
    }

  })
};

