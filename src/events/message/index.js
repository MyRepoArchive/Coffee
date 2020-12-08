const client = require('../..');
const createPrefix = require('../../controllers/prefixes/create');
const defaultPrefixo = require('../../config/default.json').prefix;
const addScore = require('../../controllers/scores/addScore');

module.exports = async (message) => {
  if (message.author.bot) return; // Verifica se o autor é um bot e retorna
  if (message.channel.type === 'dm') return; // Verifica se a mensagem foi enviada na dm e retorna
  if (client.db.cache.banned_users[message.author.id]) return;
  if (client.db.cache.banned_guilds[message.guild.id]) {
    message.guild.leave();
  };

  const distincWords = [...new Set(message.content.toLowerCase().split(''))];
  const prefix = client.db.cache.prefixes[message.guild.id] || function defaultPrefix() {
    const obj = {};
    obj[message.guild.id] = null;

    createPrefix(obj);

    return defaultPrefixo;
  }();
  const args = message.content.slice(prefix.length).trim().split(/ +/g); // Um array com cada palavra digitada pelo usuário
  const comando = args.shift().toLowerCase(); // A primeira palavra do args minúscula
  const permissions = message.channel.permissionsFor(client.user); // As permissões que o bot tem no canal em que foi enviada a mensagem
  
  if (distincWords.length >= 3 || message.content.startsWith(prefix)) 
    addScore(message.author.id, message.guild.id);
  
  /* if (message.content.includes('~=') && message.content.trim().length > 4) require('../commands/calculator.js').semelhancaStrings(message, client, connection) */

  // Se mencionar o bot no início da mensagem ele responde com o seu comando de ajuda
  if (message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`) && permissions.has("SEND_MESSAGES"))
    require('./src/mentionBot')(message, prefix);
    
  /* require('../commands/calculator.js').calc(message, client, connection) */

  if (!message.content.startsWith(prefix)) return;
  
  const cmd = client.commands.get(comando) || client.commands.find(command => command.config.aliases.includes(comando));

  if (!cmd) { // Se o comando digitado pelo usuário não for compatível com nenhum comando do bot, ele responde
    if (permissions.has("SEND_MESSAGES")) require('./src/noCmd')(comando, message, prefix);
    return;
  };

  try { // Tenta executar o comando do usuário
    cmd.run({ message, args, comando, prefix });
  } catch (e) { // Caso não consiga executar o comando, loga o erro
    require('./src/runError')(permissions, message, comando, e);
  };
};