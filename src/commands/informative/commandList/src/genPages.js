const client = require("../../../..");

module.exports = (message) => {
  const commands = client.commands.map(cmd => cmd.config.name);
  let length = 0;
  const descs = [];

  commands.forEach((command) => {
    length += command.length + 6;

    descs[parseInt(length / 2048)] ?
      descs[parseInt(length / 2048)].push(`\`${command}\``) :
      descs[parseInt(length / 2048)] = [`\`${command}\``];
  });

  const pages = descs.map((arrDesc, index) => {
    return {
      title: `Lista de comandos (${commands.length})`,
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