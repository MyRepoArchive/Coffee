const fs = require('fs')
module.exports = {
  async run(client) {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Todos os arquivos JS da pasta ./commands
    const reactCommandFiles = fs.readdirSync('./reactCommands/').filter(file => file.endsWith('.js')); // Todos os arquivos JS da pasta ./reactCommands
    const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js')); // Todos os arquivos dos eventos
    for (const file of commandFiles) { // Para cada arquivo da pasta commands vai ser setado alguns nomes
      
      const command = require(`../commands/${file}`);
      client.commands.set(command.name, command);
      client.commands.set(command.name2, command);
      client.commands.set(command.name3, command);
      client.commands.set(command.name4, command);
      client.commands.set(command.name5, command);
      client.commands.set(command.name6, command);
      client.commands.set(command.name7, command);
      client.commands.set(command.name8, command);
      client.commands.set(command.name9, command);
      client.commands.set(command.name10, command);
      client.commands.set(command.name11, command);
      client.commands.set(command.name12, command);
      client.commands.set(command.name13, command);
      client.commands.set(command.name14, command);
      client.commands.set(command.name15, command);
      client.commands.set(command.name16, command);
      client.commands.set(command.name17, command);
      client.commands.set(command.name18, command);
      client.commands.set(command.name19, command);
      client.commands.set(command.name20, command);
      client.commands.set(command.name21, command);
      client.commands.set(command.name22, command);
      client.commands.set(command.name23, command);
      client.commands.set(command.name24, command);
      client.commands.set(command.name25, command);
    }

    for (const file of reactCommandFiles) { // Para cada arquivo da pasta reactCommands vai ser setado alguns nomes
      const reactCommand = require(`../reactCommands/${file}`);
      client.reactCommands.set(reactCommand.name, reactCommand);
      client.reactCommands.set(reactCommand.name2, reactCommand);
      client.reactCommands.set(reactCommand.name3, reactCommand);
      client.reactCommands.set(reactCommand.name4, reactCommand);
      client.reactCommands.set(reactCommand.name5, reactCommand);
      client.reactCommands.set(reactCommand.name6, reactCommand);
      client.reactCommands.set(reactCommand.name7, reactCommand);
      client.reactCommands.set(reactCommand.name8, reactCommand);
      client.reactCommands.set(reactCommand.name9, reactCommand);
      client.reactCommands.set(reactCommand.name10, reactCommand);
      client.reactCommands.set(reactCommand.name11, reactCommand);
      client.reactCommands.set(reactCommand.name12, reactCommand);
      client.reactCommands.set(reactCommand.name13, reactCommand);
      client.reactCommands.set(reactCommand.name14, reactCommand);
      client.reactCommands.set(reactCommand.name15, reactCommand);
    }

    for (const file of eventFiles) {
      const event = require(`../events/${file}`);
      client.events.set(event.name, event);
    }
  }
}