const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');

module.exports = {
  name: "saque",
  name2: "sacar",
  name3: "withdraw",
  name4: "towithdrow",
  name5: "retirardobanco",
  name6: "tirardobanco",
  type: "Economia",
  description: `Saque seus **<:ccoin:750776561753522276>CCoins** do banco\nModo de usar: *${config.prefix}saque \`<valor>\`*`,

  async execute(message, args, comando, client, prefix, connection) {
    const errorAlert = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    const podeAddReactions = message.channel.memberPermissions(message.guild.member(client.user.id)).has("ADD_REACTIONS")
    if(args.length === 0) return errorAlert.run(message, client, `Saque seus **<:ccoin:750776561753522276>CCoins** do banco\nModo de usar: *${config.prefix}saque \`<valor>\`*`, 'helpcircleblue:747879943811235841') // Se o usuário não digitar argumento nenhum na frente do comando, ele envia uma mensagem de como usar
    if(podeAddReactions) await message.react('a:carregando:750817054596137000') // Reagi na mensagem com um emoji de loading
    const authorMoney = await require('../utils/getMoney.js').getMoney(connection, message.author) // Puxa do banco de dados o money do author da mensagem
    if(authorMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o valor do money do author seja indefinido, chama novamente a função execute()
    const authorBankMoney = await require('../utils/getMoney.js').getBankMoney(connection, message.author) // Puxa do banco de dados o bankmoney do author da mensagem
    if(authorBankMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o valor do bankmoney do author seja indefinido, chama novamente a função execute()
    if(isNaN(Number(args[0])) || Number(args[0]) <= 0) {// Se o primeiro argumento após o comando não poder ser lido como um número, ou ele é negativo, ou nulo, retorna uma mensagem de alerta
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id); 
      errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> Digite um valor válido para realizar o saque`, 'alertcircleamarelo:747879938207514645'); 
      return;
    }
    const saqueMoney = Number(args[0]) // Guarda na variável o valor a ser depositado
    if(saqueMoney > authorBankMoney) {  // Verifica se o author do deposito está tentando efetuar um pagamento maior do que ele possui.
      errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> Você não possui **<:ccoin:750776561753522276>CCoins** o suficiente para realizar esse depósito!`, 'alertcircleamarelo:747879938207514645')
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    if(saqueMoney + authorMoney > 50000) { // Verifica se o author do saque quer retirar mais de 50000
      errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> Você não pode fica andando por aí com mais de **<:ccoin:750776561753522276>50000**, você pode sacar somente mais **<:ccoin:750776561753522276>${50000-authorMoney}**!`, 'alertcircleamarelo:747879938207514645')
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    connection.query(`update users set money = '${authorMoney+saqueMoney}' where iduser = '${message.author.id}'`); // Adiciona dinheiro do author
    connection.query(`update users set bankmoney = '${authorBankMoney-saqueMoney}' where iduser = '${message.author.id}'`) // Retira dinheiro do banco
    errorAlert.run(message, client, `<:circlecheckverde:747879943224033481> Saque realizada com sucesso!`, 'circlecheckverde:747879943224033481') // Mensagem de confirmação de pagamento
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}