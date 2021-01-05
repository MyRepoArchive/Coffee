const client = require("../../../..");

module.exports = (message, filter) => {
  const commands = client.commands.filter(filter).map(cmd => cmd.config.name);
  let length = 0;
  const descs = [];

  if (!commands.length) return [
    {
      timestamp: new Date(),
      color: message.guild.me.displayHexColor,estamp: new Date(),
      title: 'NENHUM COMANDO ENCONTRADO!'
    }
  ];

  commands.forEach((command) => {
    length += command.length + 6;

    descs[parseInt(length / 2048)] ?
      descs[parseInt(length / 2048)].push(`\`${command}\``) :
      descs[parseInt(length / 2048)] = [`\`${command}\``];
  });

  const pages = descs.map((arrDesc, index) => {
    return {
      title: `Comandos (${commands.length})`,
      timestamp: new Date(),
      color: message.guild.me.displayHexColor,
      description: arrDesc.join(', '),
      footer: {
        text: `Página ${index + 1} de ${descs.length}`
      }
    };
  });

  return pages;
}