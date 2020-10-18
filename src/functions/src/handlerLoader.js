const Discord = require('discord.js');
const fs = require('fs');
const { client } = require('..')

module.exports = () => {
  client.commands = new Discord.Collection(); // Collection com os comandos do bot
  client.events = new Discord.Collection(); // Collection dos eventos em que o bot está inscrito

  fs.readdirSync('./src/commands', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .forEach(dirent => {
    const commandsOfType = {};

    fs.readdirSync(`./src/commands/${dirent.name}`, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
      const command = require(`../../commands/${dirent.name}`);

      commandsOfType[command.config.name] = command;
    });

    client.commands.set(dirent.name, commandsOfType);
  });

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

module.exports();