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
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    if(!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 10000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((10000-parseInt(Date.now() - this.cooldown[message.author.id].timestamp))/1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 10000){
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }

    const podeAddReactions = message.channel.memberPermissions(message.guild.member(client.user.id)).has("ADD_REACTIONS")
    if(args.length === 0) return run(message, client, `Deposite seus **<:${emojis.ccoin}>CCoins** no banco para poder aparecer no rank dos riquinhos  ou transferir quantias maiores para seus amigos (ou agiotas)!\nModo de usar: *${config.prefix}deposit \`<valor>\`*`, emojis.helpcircleblue) // Se o usuário não digitar argumento nenhum na frente do comando, ele envia uma mensagem de como usar
    if(podeAddReactions) await message.react(emojis.carregando) // Reagi na mensagem com um emoji de loading
    const getMoney = await require('../utils/getMoney.js').getMoney(connection, message.author)
    const authorMoney = getMoney.money // Puxa do banco de dados o money do author da mensagem
    const authorBankMoney = getMoney.bankmoney // Puxa do banco de dados o bankmoney do author da mensagem
    if(isNaN(Number(args[0])) || Number(args[0]) <= 0) {// Se o primeiro argumento após o comando não poder ser lido como um número, ou ele é negativo, ou nulo, retorna uma mensagem de alerta
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id); 
      run(message, client, `<:${emojis.alertcircleamarelo}> Digite um valor válido para ser depositado!`, emojis.alertcircleamarelo); 
      return;
    }
    const depositMoney = Number(args[0]) // Guarda na variável o valor a ser depositado
    if(depositMoney > authorMoney) {  // Verifica se o author do deposito está tentando efetuar um pagamento maior do que ele possui.
      run(message, client, `<:${emojis.alertcircleamarelo}> Você não possui **<:${emojis.ccoin}>CCoins** o suficiente para realizar esse depósito!`, emojis.alertcircleamarelo)
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    connection.query(`update users set money = '${authorMoney-depositMoney}', bankmoney = '${authorBankMoney+depositMoney}' where iduser = '${message.author.id}'`); // Retira dinheiro do author
    run(message, client, `<:${emojis.circlecheckverde}> Depósito realizado com sucesso!`, emojis.circlecheckverde) // Mensagem de confirmação de pagamento
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}