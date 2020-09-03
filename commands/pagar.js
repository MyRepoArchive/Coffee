const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');

module.exports = {
  name: "pagar",
  name2: "pague",
  name3: "pay",
  type: "Economia",
  description: `Pague **<:ccoin:750776561753522276>CCoins** para outra pessoa!\nModo de usar: *${config.prefix}pagar \`<valor>\` @user*`,

  async execute(message, args, comando, client, prefix, connection) {
    const errorAlert = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    const podeAddReactions = message.channel.memberPermissions(message.guild.member(client.user.id)).has("ADD_REACTIONS")
    if(args.length === 0) return errorAlert.run(message, client, `Pague **<:ccoin:750776561753522276>CCoins** para outra pessoa!\nModo de usar: *${prefix}pagar \`<valor>\` @user*`, 'helpcircleblue:747879943811235841') // Se o usuári não digitar argumento nenhum na frente do comando, ele envia uma mensagem de como usar
    let mentioned = message.mentions.users.first() // Pega o primeiro usuario mencionado, caso haja algum!
    if(!mentioned) {
      mentioned = message.guild.members.cache.find(member => member.user.username === args.slice(1).join(' '))
      if(!mentioned) {
        mentioned = message.guild.members.cache.find(member => member.nickname === args.slice(1).join(' '))
        if(!mentioned) {
          mentioned = message.guild.members.cache.get(args[1])
          if(!mentioned)return errorAlert.run(message, client, '<:alertcircleamarelo:747879938207514645> Mencione o usuário a quem deseja pagar!', 'alertcircleamarelo:747879938207514645') // Se não houver menções retorna uma mensagem de alerta
        }
      }
    }
    if(mentioned.user !== undefined) mentioned = mentioned.user // Se o mentioned retornar um membro, ele passa mentioned para user novamente
    if(mentioned === message.author) return errorAlert.run(message, client, '<:helpcircleblue:747879943811235841> Você não pode pagar a si mesmo!', 'helpcircleblue:747879943811235841'); // Se o mencionado for o próprio autor da mensagem, retorna um alerta
    if(mentioned.bot) return errorAlert.run(message, client, '<:alertcircleamarelo:747879938207514645> Infelizmente bots não podem receber **<:ccoin:750776561753522276>CCoins**!', 'alertcircleamarelo:747879938207514645') // Verifica se a pessoa mencionada é um bot, pois bots não podem receber CCoins
    if(podeAddReactions) await message.react('a:carregando:750817054596137000') // Reagi na mensagem com um emoji de loading
    const authorMoney = await require('../utils/getMoney.js').getMoney(connection, message.author) // Puxa do banco de dados o money do author da mensagem
    if(authorMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o valor do money do author seja indefinido, chama novamente a função execute()
    const mentionedMoney = await require('../utils/getMoney.js').getMoney(connection, mentioned) // Puxa do banco o money do user mencionado
    if(mentionedMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o money do mencionado por indefinido, chama novamente a função eexecute()
    if(isNaN(Number(args[0])) || Number(args[0]) <= 0) {// Se o primeiro argumento após o comando não poder ser lido como um número, ou ele é negativo, ou nulo, retorna uma mensagem de alerta
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id); 
      errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> Digite um valor válido para o pagamento!`, 'alertcircleamarelo:747879938207514645'); 
      return;
    }
    const transferMoney = Number(args[0]) // Guarda na variável o valor a ser transferido se um user para o outro
    if(transferMoney > authorMoney) {  // Verifica se o author do pagamento está tentando efetuar um pagamento maior do que ele possui.
      errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> Você não possui **<:ccoin:750776561753522276>CCoins** o suficiente para realizar esse pagamento!`, 'alertcircleamarelo:747879938207514645')
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    if(transferMoney > 1000) { // Verifica se o valor a ser pago é maior do que o limite de pagamento
      errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> O limite para pagamentos mão a mão é de **<:ccoin:750776561753522276>1000**, para transferir valores maiores use *${prefix}transferir \`<valor>\` @user*`, 'alertcircleamarelo:747879938207514645')
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    if(mentionedMoney + transferMoney > 50000) {
      errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> O usuário para o qual você deseja pagar já possui **<:ccoin:750776561753522276>CCoins** demais em mãos e só pode receber mais **<:ccoin:750776561753522276>${50000-mentionedMoney}**, para transferir valores maiores use *${prefix}transferir \`<valor>\` @user*`, 'alertcircleamarelo:747879938207514645')
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    connection.query(`update users set money = '${authorMoney-transferMoney}' where iduser = '${message.author.id}'`); // Retira dinheiro do author
    connection.query(`update users set money = '${mentionedMoney+transferMoney}' where iduser = '${mentioned.id}'`) // Adiciona dinheiro no mentioned
    errorAlert.run(message, client, `<:circlecheckverde:747879943224033481> Pagamento realizado com sucesso!`, 'circlecheckverde:747879943224033481') // Mensagem de confirmação de pagamento
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}