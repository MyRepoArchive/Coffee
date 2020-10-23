const Discord = require('discord.js');
const fs = require('fs');
const client = require('../..');
const api = require('../../services/api');
const { apiAuthToken } = require('../../config/auth.json');

module.exports = () => {
  // Collections com os comandos do bot
  client.commands = new Discord.Collection();

  api.get('/commands')
    .then(response => {
      loadCommands(response.data);
    }).catch(e => {
      console.error(
        `> Erro!\n` +
        '> Houve um erro ao fazer uma requisição na api para buscar todos os comandos!\n' +
        `> Path: "${__dirname}"\n` +
        `> Erro: "${e}"`
      );

      loadCommands();
    });

  // Loop por todos os eventos da pasta eventos
  fs.readdirSync('./src/events', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
      const event = require(`../../events/${dirent.name}`);

      client.on(dirent.name, (...params) => event(params));
    });


  function loadCommands(commands) {
    fs.readdirSync('./src/commands', { withFileTypes: true })
      .filter(category => category.isDirectory())
      .forEach(category => {
        // Faz um loop por todos os comandos que estão em cada uma das categoriase seta o comando na collection
        fs.readdirSync(`./src/commands/${category.name}`, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .forEach(dirent => {
            const command = require(`../../commands/${category.name}/${dirent.name}`);
            const cmdConfig = command.config;

            if (commands) {
              const commandApi = commands.find(cmd => cmd.name === cmdConfig.name);

              if (!commandApi) {
                api.put('/commands/create', {
                  name: cmdConfig.name,
                  aliases: cmdConfig.aliases,
                  type: cmdConfig.type,
                  description: cmdConfig.description,
                  howToUse: cmdConfig.howToUse,
                  cooldown: cmdConfig.cooldown,
                  example: cmdConfig.example,
                  exampleUrl: cmdConfig.exampleUrl,
                  createdTimestamp: cmdConfig.createdTimestamp,
                  updatedTimestamp: cmdConfig.updatedTimestamp,
                  version: cmdConfig.version,
                  releasesNotes: cmdConfig.releasesNotes,
                  timesLimit: cmdConfig.timesLimit,
                  active: cmdConfig.active ? 1 : 0
                }, {
                  headers: {
                    Authorization: `Bearer ${apiAuthToken}`
                  }
                })
                  .then(created => console.log(
                    `> Aviso!\n` +
                    '> Novo comando criado noi banco de dados!\n' +
                    `> Criado: ${created.data}`
                  ))
                  .catch(e => console.error(
                    `> Erro!\n` +
                    '> Um comando não foi criado no banco de dados!\n' +
                    `> Comando que deveria ser criado: ${cmdConfig}\n` +
                    `> Erro: "${e}"`
                  ));
              } else {
                command.config.cooldown = commandApi.cooldown;
                command.config.timesLimit = commandApi.timesLimit;
                command.config.active = commandApi.active === 1;
              };
            };

            client.commands.set(cmdConfig.name, command);
          });
      });
  }
};