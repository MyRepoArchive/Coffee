const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "deposit",
  name2: "depositar",
  name3: "porembanco",
  name4: "pornobanco",
  name5: "putinbank",
  type: "Economia",
  description: `Deposite seus **<:${emojis.ccoin}>CCoins** no banco para poder aparecer no rank dos riquinhos  ou transferir quantias maiores para seus amigos (ou agiotas)!\nModo de usar: *${config.prefix}deposit \`<valor>\`*`,

  async execute(message, args, comando, client, prefix, connection) {
    const errorAlert = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    const podeAddReactions = message.channel.memberPermissions(message.guild.member(client.user.id)).has("ADD_REACTIONS")
    if(args.length === 0) return errorAlert.run(message, client, `Deposite seus **<:${emojis.ccoin}>CCoins** no banco para poder aparecer no rank dos riquinhos  ou transferir quantias maiores para seus amigos (ou agiotas)!\nModo de usar: *${config.prefix}deposit \`<valor>\`*`, emojis.helpcircleblue) // Se o usuário não digitar argumento nenhum na frente do comando, ele envia uma mensagem de como usar
    if(podeAddReactions) await message.react(emojis.carregando) // Reagi na mensagem com um emoji de loading
    const authorMoney = await require('../utils/getMoney.js').getMoney(connection, message.author) // Puxa do banco de dados o money do author da mensagem
    if(authorMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o valor do money do author seja indefinido, chama novamente a função execute()
    const authorBankMoney = await require('../utils/getMoney.js').getBankMoney(connection, message.author) // Puxa do banco de dados o bankmoney do author da mensagem
    if(authorBankMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o valor do bankmoney do author seja indefinido, chama novamente a função execute()
    if(isNaN(Number(args[0])) || Number(args[0]) <= 0) {// Se o primeiro argumento após o comando não poder ser lido como um número, ou ele é negativo, ou nulo, retorna uma mensagem de alerta
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id); 
      errorAlert.run(message, client, `<:${emojis.alertcircleamarelo}> Digite um valor válido para ser depositado!`, 'alertcircleamarelo:747879938207514645'); 
      return;
    }
    const depositMoney = Number(args[0]) // Guarda na variável o valor a ser depositado
    if(depositMoney > authorMoney) {  // Verifica se o author do deposito está tentando efetuar um pagamento maior do que ele possui.
      errorAlert.run(message, client, `<:${emojis.alertcircleamarelo}> Você não possui **<:${emojis.ccoin}>CCoins** o suficiente para realizar esse depósito!`, emojis.alertcircleamarelo)
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    connection.query(`update users set money = '${authorMoney-depositMoney}' where iduser = '${message.author.id}'`); // Retira dinheiro do author
    connection.query(`update users set bankmoney = '${authorBankMoney+depositMoney}' where iduser = '${message.author.id}'`) // Adiciona dinheiro no mentioned
    errorAlert.run(message, client, `<:${emojis.circlecheckverde}> Depósito realizado com sucesso!`, emojis.circlecheckverde) // Mensagem de confirmação de pagamento
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}