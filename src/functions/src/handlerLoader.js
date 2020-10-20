const Discord = require('discord.js');
const fs = require('fs');
const client = require('../..');

module.exports = () => {
  // Collections com os comandos e eventos do bot
  client.commands = new Discord.Collection();
  client.events = new Discord.Collection();
  
  // Faz um loop por todas as categorias que estão na pasta commands
  fs.readdirSync('./src/commands', { withFileTypes: true })
  .filter(category => category.isDirectory())
  .forEach(category => {
    // Faz um loop por todos os comandos que estão em cada uma das categoriase seta o comando na collection
    fs.readdirSync(`./src/commands/${dirent.name}`, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
      const command = require(`../../commands/${category.name}/${dirent.name}`);

      client.commands.set(command.config.name, command);
    });
  });

  // Loop por todos os eventos da pasta eventos
  fs.readdirSync('./src/events', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .forEach(dirent => {
    const event = require(`../../events/${dirent.name}`);

    client.events.set(event.config.name, event);
  });
};