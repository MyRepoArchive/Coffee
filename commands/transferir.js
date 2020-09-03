const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');

module.exports = {
  name: "transferir",
  name2: "transferência",
  name3: "transfer",
  type: "Economia",
  description: `Transfira **<:ccoin:750776561753522276>CCoins** da sua conta bancária para outras contas bancárias, sem limitações de quantidade.\nModo de usar: *${config.prefix}transferir \`<valor>\` @user*`,

  async execute(message, args, comando, client, prefix, connection) {
    const errorAlert = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    const podeAddReactions = message.channel.memberPermissions(message.guild.member(client.user.id)).has("ADD_REACTIONS")
    if(args.length === 0) return errorAlert.run(message, client, `Transfira **<:ccoin:750776561753522276>CCoins** da sua conta bancária para outras contas bancárias, sem limitações de quantidade.\nModo de usar: *${config.prefix}transferir \`<valor>\` @user*`, 'helpcircleblue:747879943811235841') // Se o usuári não digitar argumento nenhum na frente do comando, ele envia uma mensagem de como usar
    let mentioned = message.mentions.users.first() // Pega o primeiro usuario mencionado, caso haja algum!
    if(!mentioned) {
      mentioned = message.guild.members.cache.find(member => member.user.username === args.slice(1).join(' '))
      if(!mentioned) {
        mentioned = message.guild.members.cache.find(member => member.nickname === args.slice(1).join(' '))
        if(!mentioned) {
          mentioned = message.guild.members.cache.get(args[1])
          if(!mentioned)return errorAlert.run(message, client, '<:alertcircleamarelo:747879938207514645> Mencione o usuário a quem deseja transferir **<:ccoin:750776561753522276>CCoins**!', 'alertcircleamarelo:747879938207514645') // Se não houver menções retorna uma mensagem de alerta
        }
      }
    }
    if(mentioned.user !== undefined) mentioned = mentioned.user // Se o mentioned retornar um membro, ele passa mentioned para user novamente
    if(mentioned === message.author) return errorAlert.run(message, client, '<:helpcircleblue:747879943811235841> Você não pode transferir **<:ccoin:750776561753522276>CCoins** a si mesmo!', 'helpcircleblue:747879943811235841'); // Se o mencionado for o próprio autor da mensagem, retorna um alerta
    if(mentioned.bot) return errorAlert.run(message, client, '<:alertcircleamarelo:747879938207514645> Infelizmente bots não podem receber **<:ccoin:750776561753522276>CCoins**!', 'alertcircleamarelo:747879938207514645') // Verifica se a pessoa mencionada é um bot, pois bots não podem receber CCoins
    if(podeAddReactions) await message.react('a:carregando:750817054596137000') // Reagi na mensagem com um emoji de loading
    const authorBankMoney = await require('../utils/getMoney.js').getBankMoney(connection, message.author) // Puxa do banco de dados o money do author da mensagem
    if(authorBankMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o valor do money do author seja indefinido, chama novamente a função execute()
    const mentionedBankMoney = await require('../utils/getMoney.js').getBankMoney(connection, mentioned) // Puxa do banco o money do user mencionado
    if(mentionedBankMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o money do mencionado por indefinido, chama novamente a função eexecute()
    if(isNaN(Number(args[0])) || Number(args[0]) <= 0) {// Se o primeiro argumento após o comando não poder ser lido como um número, ou ele é negativo, ou nulo, retorna uma mensagem de alerta
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id); 
      errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> Digite um valor válido para a transferência!`, 'alertcircleamarelo:747879938207514645'); 
      return;
    }
    const transferMoney = Number(args[0]) // Guarda na variável o valor a ser transferido se um user para o outro
    if(transferMoney > authorBankMoney) {  // Verifica se o author do pagamento está tentando efetuar um pagamento maior do que ele possui.
      errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> Você não possui **<:ccoin:750776561753522276>CCoins** o suficiente para realizar esta transferência!`, 'alertcircleamarelo:747879938207514645')
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id);
      return;
    }
    connection.query(`update users set bankmoney = '${authorBankMoney-transferMoney}' where iduser = '${message.author.id}'`); // Retira dinheiro do author
    connection.query(`update users set bankmoney = '${mentionedBankMoney+transferMoney}' where iduser = '${mentioned.id}'`) // Adiciona dinheiro no mentioned
    errorAlert.run(message, client, `<:circlecheckverde:747879943224033481> Transferência concluída com sucesso!`, 'circlecheckverde:747879943224033481') // Mensagem de confirmação de pagamento
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}