const fs = require('fs')
module.exports = {
  async run(client) {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Todos os arquivos JS da pasta ./commands
    const reactCommandFiles = fs.readdirSync('./reactCommands/').filter(file => file.endsWith('.js')); // Todos os arquivos JS da pasta ./reactCommands
    const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js')); // Todos os arquivos dos eventos
    for (const file of commandFiles) { // Para cada arquivo da pasta commands vai ser setado alguns nomes
      
      const command = require(`../commands/${file}`);
      client.commands.set(command.name, command);
    }

    for (const file of reactCommandFiles) { // Para cada arquivo da pasta reactCommands vai ser setado alguns nomes
      const reactCommand = require(`../reactCommands/${file}`);
      client.reactCommands.set(reactCommand.name, reactCommand);
    }

    for (const file of eventFiles) {
      const event = require(`../events/${file}`);
      client.events.set(event.name, event);
    }
  }
}