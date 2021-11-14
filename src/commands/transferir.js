const Discord = require('discord.js');
const hex = require('../../colors.json');
const config = require('../../info.json');
const emojis = require('../../emojis.json')

module.exports = {
  name: "transferir",
  aliases: ["transferência", "transfer"],
  type: "Economia",
  description: `Transfira **<:${emojis.linecoinbitcoin}>CCoins** da sua conta bancária para outras contas bancárias, sem limitações de quantidade.\nModo de usar: *${config.prefix}transferir \`<valor>\` @user*`,
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
    if(args.length === 0) return run(message, client, `Transfira **<:${emojis.linecoinbitcoin}>CCoins** da sua conta bancária para outras contas bancárias, sem limitações de quantidade.\nModo de usar: *${config.prefix}transferir \`<valor>\` @user*`, emojis.helpcircleblue) // Se o usuário não digitar argumento nenhum na frente do comando, ele envia uma mensagem de como usar
    let mentioned = message.mentions.users.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.slice(1).join(' ').toLowerCase()) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.slice(1).join(' ').toLowerCase()) || message.guild.members.cache.get(args[1])// Pega o primeiro usuario mencionado, caso haja algum!
    if(!mentioned)return run(message, client, `<:${emojis.alertcircleamarelo}> Mencione o usuário a quem deseja transferir **<:${emojis.linecoinbitcoin}>CCoins**!`, emojis.alertcircleamarelo) // Se não houver menções retorna uma mensagem de alerta
    
    if(mentioned.user !== undefined) mentioned = mentioned.user // Se o mentioned retornar um membro, ele passa mentioned para user novamente
    if(mentioned === message.author) return run(message, client, `<:${emojis.helpcircleblue}> Você não pode transferir **<:${emojis.linecoinbitcoin}>CCoins** a si mesmo!`, emojis.helpcircleblue); // Se o mencionado for o próprio autor da mensagem, retorna um alerta
    if(mentioned.bot) return run(message, client, `<:${emojis.alertcircleamarelo}> Infelizmente bots não podem receber **<:${emojis.linecoinbitcoin}>CCoins**!`, emojis.alertcircleamarelo) // Verifica se a pessoa mencionada é um bot, pois bots não podem receber CCoins
    if(podeAddReactions) await message.react(emojis.carregando) // Reagi na mensagem com um emoji de loading
    const getMoney = await require('../utils/getMoney.js').getMoney(connection, message.author)
    const getMentionedMoney = await require('../utils/getMoney.js').getMoney(connection, mentioned)
    const authorBankMoney = getMoney.bankmoney // Puxa do banco de dados o money do author da mensagem
    const mentionedBankMoney = getMentionedMoney.bankmoney // Puxa do banco o money do user mencionado
    const getRateReducer = await require('../utils/getRateReducer.js').getCacheRateReducer(connection, message.author, message.guild)
    const rateReducer = getRateReducer/100
    if(isNaN(Number(args[0])) || Number(args[0]) <= 0) {// Se o primeiro argumento após o comando não poder ser lido como um número, ou ele é negativo, ou nulo, retorna uma mensagem de alerta
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id); 
      run(message, client, `<:${emojis.alertcircleamarelo}> Digite um valor válido para a transferência!`, emojis.alertcircleamarelo); 
      return;
    }
    const transferMoney = Number(args[0]) // Guarda na variável o valor a ser transferido se um user para o outro
    if(transferMoney > authorBankMoney) {  // Verifica se o author do pagamento está tentando efetuar um pagamento maior do que ele possui.
      run(message, client, `<:${emojis.alertcircleamarelo}> Você não possui **<:${emojis.linecoinbitcoin}>CCoins** o suficiente para realizar esta transferência!`, emojis.alertcircleamarelo)
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    connection.query(`update users set bankmoney = case iduser when ${message.author.id} then '${authorBankMoney-transferMoney}' when ${mentioned.id} then '${mentionedBankMoney+(transferMoney*(0.8+rateReducer))}' end where iduser in (${message.author.id}, ${mentioned.id})`); // Retira dinheiro do author
    run(message, client, `<:${emojis.circlecheckverde}> Transferência concluída com sucesso! \`${20-rateReducer*100}% de taxa\``, emojis.circlecheckverde) // Mensagem de confirmação de pagamento
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}