const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json')

module.exports = {
  name: "saque",
  aliases: ["sacar", "withdraw","towithdrow", "retirardobanco", "tirardobanco"],
  type: "Economia",
  description: `Saque seus **<:${emojis.linecoinbitcoin}>CCoins** do banco\nModo de usar: *${config.prefix}saque \`<valor>\`*`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    if(!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 30000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((30000-parseInt(Date.now() - this.cooldown[message.author.id].timestamp))/1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 30000){
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }
    const podeAddReactions = message.channel.memberPermissions(message.guild.member(client.user.id)).has("ADD_REACTIONS")
    if(args.length === 0) return run(message, client, `Saque seus **<:${emojis.linecoinbitcoin}>CCoins** do banco\nModo de usar: *${config.prefix}saque \`<valor>\`*`, emojis.helpcircleblue) // Se o usuário não digitar argumento nenhum na frente do comando, ele envia uma mensagem de como usar
    if(podeAddReactions) await message.react(emojis.carregando) // Reagi na mensagem com um emoji de loading
    const getMoney = await require('../utils/getMoney.js').getMoney(connection, message.author)
    const authorMoney = await require('../utils/getMoney.js').getServerMoney(connection, message.author, message.guild) // Puxa do banco de dados o money do author da mensagem
    const authorBankMoney = getMoney.bankmoney // Puxa do banco de dados o bankmoney do author da mensagem
    if(isNaN(Number(args[0])) || Number(args[0]) <= 0) {// Se o primeiro argumento após o comando não poder ser lido como um número, ou ele é negativo, ou nulo, retorna uma mensagem de alerta
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id); 
      run(message, client, `<:${emojis.alertcircleamarelo}> Digite um valor válido para realizar o saque`, emojis.alertcircleamarelo); 
      return;
    }
    const saqueMoney = Number(args[0]) // Guarda na variável o valor a ser depositado
    if(saqueMoney > authorBankMoney) { // Verifica se o author do deposito está tentando efetuar um pagamento maior do que ele possui.
      run(message, client, `<:${emojis.alertcircleamarelo}> Você não possui **<:${emojis.linecoinbitcoin}>CCoins** o suficiente para realizar esse saque!`, emojis.alertcircleamarelo)
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    connection.query(`update users set bankmoney = '${authorBankMoney-saqueMoney}' where iduser = '${message.author.id}'`); // Adiciona dinheiro do author
    connection.query(`update score_per_server set money = '${authorMoney+(saqueMoney*0.8)}' where userid = '${message.author.id}' and serverid = '${message.guild.id}'`)
    run(message, client, `<:${emojis.circlecheckverde}> Saque realizada com sucesso! \`${100-100*0.8}% de taxa\``, emojis.circlecheckverde) // Mensagem de confirmação de pagamento
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}