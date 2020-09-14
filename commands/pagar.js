const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json')

module.exports = {
  name: "pagar",
  aliases: ["pague", "pay"],
  type: "Economia",
  description: `Pague **<:${emojis.linecoinbitcoin}>CCoins** para outra pessoa!\nModo de usar: *${config.prefix}pagar \`<valor>\` @user*`,
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
    if(args.length === 0) return run(message, client, `<:${emojis.linebankcard}> Pague **<:${emojis.linecoinbitcoin}>CCoins** para outra pessoa!\nModo de usar: *${prefix}pagar \`<valor>\` @user*`, emojis.helpcircleblue) // Se o usuário não digitar argumento nenhum na frente do comando, ele envia uma mensagem de como usar
    let mentioned = message.mentions.users.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.slice(1).join(' ').toLowerCase()) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.slice(1).join(' ').toLowerCase()) || message.guild.members.cache.get(args[1])  // Pega o primeiro usuario mencionado, caso haja algum!
    if(!mentioned)return run(message, client, `<:${emojis.alertcircleamarelo}> Mencione o usuário a quem deseja pagar!`, emojis.alertcircleamarelo) // Se não houver menções retorna uma mensagem de alerta
    if(mentioned.user !== undefined) mentioned = mentioned.user // Se o mentioned retornar um membro, ele passa mentioned para user novamente
    if(mentioned === message.author) return run(message, client, `<:${emojis.alertcircleamarelo}> Você não pode pagar a si mesmo!`, emojis.helpcircleblue); // Se o mencionado for o próprio autor da mensagem, retorna um alerta
    if(mentioned.bot) return run(message, client, `<:${emojis.alertcircleamarelo}> Infelizmente bots não podem receber **<:${emojis.linecoinbitcoin}>CCoins**!`, emojis.alertcircleamarelo) // Verifica se a pessoa mencionada é um bot, pois bots não podem receber CCoins
    if(podeAddReactions) await message.react(emojis.carregando) // Reagi na mensagem com um emoji de loading
    const authorMoney = await require('../utils/getMoney.js').getServerMoney(connection, message.author, message.guild)
    const mentionedMoney = await require('../utils/getMoney.js').getServerMoney(connection, mentioned, message.guild)
    if(isNaN(Number(args[0])) || Number(args[0]) <= 0) {// Se o primeiro argumento após o comando não poder ser lido como um número, ou ele é negativo, ou nulo, retorna uma mensagem de alerta
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id); 
      run(message, client, `<:${emojis.alertcircleamarelo}> Digite um valor válido para o pagamento!`, emojis.alertcircleamarelo); 
      return;
    }
    const transferMoney = Number(args[0]) // Guarda na variável o valor a ser transferido se um user para o outro
    if(transferMoney > authorMoney) {  // Verifica se o author do pagamento está tentando efetuar um pagamento maior do que ele possui.
      run(message, client, `<:${emojis.alertcircleamarelo}> Você não possui **<:${emojis.linecoinbitcoin}>CCoins** o suficiente para realizar esse pagamento!`, emojis.alertcircleamarelo)
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    if(transferMoney > 1000) { // Verifica se o valor a ser pago é maior do que o limite de pagamento
      run(message, client, `<:${emojis.alertcircleamarelo}> O limite para pagamentos mão a mão é de **<:${emojis.linecoinbitcoin}>1000**, para transferir valores maiores use *${prefix}transferir \`<valor>\` @user*`, emojis.alertcircleamarelo)
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    connection.query(`update score_per_server set money = case userid when ${message.author.id} then '${authorMoney-transferMoney}' when ${mentioned.id} then '${mentionedMoney+transferMoney}' end where userid in (${message.author.id}, ${mentioned.id}) and serverid = '${message.guild.id}'`); // Retira dinheiro do author e adiciona no mencionado
    run(message, client, `<:${emojis.circlecheckverde}> Pagamento realizado com sucesso!`, emojis.circlecheckverde) // Mensagem de confirmação de pagamento
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}