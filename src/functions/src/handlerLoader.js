const Discord = require('discord.js');
const fs = require('fs');
const client = require('../..');
const api = require('../../services/api');
const { static: { emoji } } = require('../../utils/emojis.json');
const { reset, yellow, cyan, red } = require('../../utils/Console');

module.exports = () => {
  const { apiAuthToken } = require('../../config/auth.json');
  const { apiError, error } = require('..');

  // Collections com os comandos do bot
  client.commands = new Discord.Collection();

  // Loop por todos os eventos da pasta eventos
  console.log(`${yellow}==================== LOADING EVENTS ====================${reset}`);
  fs.readdirSync('./src/events', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
      const event = require(`../../events/${dirent.name}`);

      client.on(dirent.name, (...params) => event(...params));

      console.log(`Evento ${cyan}${dirent.name.toUpperCase()}${reset} carregado com sucesso!`);
    });
  console.log(`${yellow}========================================================${reset}`);

  api.get('/commands')
    .then(response => {
      console.log(`${yellow}==================== LOADING COMMANDS ====================${reset}`);
      loadCommands(response.data);
      console.log(`${yellow}==========================================================${reset}`);
    }, e => {
      error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Houve um erro ao fazer uma requisição na api para buscar todos os comandos!\n' +
        `> Path: "${__dirname}"\n` +
        `> Erro: "${apiError(e)}"`
      );

      console.log(`${red}==================== LOADING COMMANDS (bad loading) ====================${reset}`);
      loadCommands();
      console.log(`${red}========================================================================${reset}`);
    });

  function loadCommands(commands) {
    fs.readdirSync('./src/commands', { withFileTypes: true })
      .filter(category => category.isDirectory())
      .forEach(category => {
        console.log(`${yellow}${category.name.toUpperCase()} COMMANDS LOADING${reset}`);

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
                  ), e => console.error(
                    `> Erro!\n` +
                    '> Um comando não foi criado no banco de dados!\n' +
                    `> Comando que deveria ser criado: ${cmdConfig}\n` +
                    `> Erro: "${apiError(e)}"`
                  ));
              } else {
                command.config.cooldown = commandApi.cooldown;
                command.config.timesLimit = commandApi.timesLimit;
                command.config.active = commandApi.active === 1;
              };
            };

            client.commands.set(cmdConfig.name, command);

            console.log(`Comando ${cyan}${cmdConfig.name.toUpperCase()}${reset} carregado com sucesso!`);
          });
      });
  }
};