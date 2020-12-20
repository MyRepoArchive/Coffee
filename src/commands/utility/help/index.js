const client = require('../../..');
const commandDetails = require('./src/commandDetails');
const categoryDetails = require('./src/categoryDetails');
const { MessageEmbed } = require('discord.js');
const chatOrDm = require('../../../functions/chatOrDm');

module.exports = {
  config: require('./src/config'),

  run({ message, args, prefix, permissions }) {
    const distinctCategories = [...new Set(client.commands.map(x => x.config.type))];
    const argumentos = args.join(' ');
    const comando = getComando(argumentos);
    const category = getCategory(argumentos);

    if (comando) return commandDetails(comando.config, message, permissions);
    if (category) return categoryDetails(category, message, permissions);

    const embed = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp()
      .setFooter(`Você pode utilizar ${prefix}ajuda <comando> ou ${prefix}ajuda <categoria_de_comandos> para obter informações mais detalhadas`);

    distinctCategories.forEach((category) => {
      const commandsForCategory = client.commands.filter(cmd => cmd.config.type === category);

      embed.addField(`${category} (\`${commandsForCategory.map(x => x).length}\`)`, `\`${commandsForCategory.map(x => x.config.name).join('`, `')}\``);
    })

    chatOrDm(embed, permissions, message);

    function getComando(argumentos) {
      const cmd = argumentos ? argumentos.toLowerCase() : '';

      return client.commands.get(cmd) || client.commands.find(command => command.config.aliases.includes(cmd));
    };

    function getCategory(argumentos) {
      const category = argumentos ? argumentos.toLowerCase() : '';
      const categories = distinctCategories.map(cat => cat.toLowerCase());

      return categories.find(x => x === category);
    };
  }
};