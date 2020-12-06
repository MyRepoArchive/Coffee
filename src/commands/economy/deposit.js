const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "deposit",
  aliases: ["depositar", "porembanco", "pornobanco", "putinbank"],
  type: "Economia",
  description: `Deposite seus **<:${emojis.linecoinbitcoin}>CCoins** no banco para poder aparecer no rank dos riquinhos  ou transferir quantias maiores para seus amigos (ou agiotas)! Com o dinheiro no banco você também pode comprar itens globais que valem para todos os servidores...\nModo de usar: *${config.prefix}deposit \`<valor>\`*`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    if(!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 20000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((20000-parseInt(Date.now() - this.cooldown[message.author.id].timestamp))/1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 20000){
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }

    const podeAddReactions = message.channel.memberPermissions(message.guild.member(client.user.id)).has("ADD_REACTIONS")
    if(args.length === 0) return run(message, client, `Deposite seus **<:${emojis.linecoinbitcoin}>CCoins** no banco para poder aparecer no rank dos riquinhos  ou transferir quantias maiores para seus amigos (ou agiotas)! Com o dinheiro no banco você também pode comprar itens globais que valem para todos os servidores...\nModo de usar: *${config.prefix}deposit \`<valor>\`*`, emojis.helpcircleblue) // Se o usuário não digitar argumento nenhum na frente do comando, ele envia uma mensagem de como usar
    if(podeAddReactions) await message.react(emojis.carregando) // Reagi na mensagem com um emoji de loading
    const getMoney = await require('../utils/getMoney.js').getMoney(connection, message.author)
    const authorMoney = await require('../utils/getMoney.js').getServerMoney(connection, message.author, message.guild)
    const authorBankMoney = getMoney.bankmoney // Puxa do banco de dados o bankmoney do author da mensagem
    const getRateReducer = await require('../utils/getRateReducer.js').getCacheRateReducer(connection, message.author, message.guild)
    const rateReducer = getRateReducer/100
    if(isNaN(Number(args[0])) || Number(args[0]) <= 0) {// Se o primeiro argumento após o comando não poder ser lido como um número, ou ele é negativo, ou nulo, retorna uma mensagem de alerta
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id); 
      run(message, client, `<:${emojis.alertcircleamarelo}> Digite um valor válido para ser depositado!`, emojis.alertcircleamarelo); 
      return;
    }
    const depositMoney = Number(args[0]) // Guarda na variável o valor a ser depositado
    if(depositMoney > authorMoney) {  // Verifica se o author do deposito está tentando efetuar um pagamento maior do que ele possui.
      run(message, client, `<:${emojis.alertcircleamarelo}> Você não possui **<:${emojis.linecoinbitcoin}>CCoins** o suficiente para realizar esse depósito!`, emojis.alertcircleamarelo)
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    connection.query(`update score_per_server set money = '${authorMoney-depositMoney}' where userid = '${message.author.id}' and serverid = '${message.guild.id}'`)
    connection.query(`update users set bankmoney = '${authorBankMoney+(depositMoney*(0.8+rateReducer))}' where iduser = '${message.author.id}'`); 
    run(message, client, `<:${emojis.circlecheckverde}> Depósito realizado com sucesso! \`${20-rateReducer*100}% de taxa\``, emojis.circlecheckverde) // Mensagem de confirmação de pagamento
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}