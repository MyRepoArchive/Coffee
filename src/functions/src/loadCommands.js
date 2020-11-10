const api = require('../../services/api');
const { reset, yellow, cyan, red } = require('../../utils/Console');
const fs = require('fs');
const { static: { emoji } } = require('../../utils/emojis.json');
const client = require('../..');
const Discord = require('discord.js');

module.exports = (auth = false) => {
  // Collections com os comandos do bot
  client.commands = new Discord.Collection();

  const { apiAuthToken } = require('../../config/auth.json');
  const { logger, apiError, error } = require('..');

  api.get('/commands')
    .then(response => {
      if (auth) {
        console.log(`${yellow}==================== LOADING COMMANDS ====================${reset}`);
        load(response.data);
        console.log(`${yellow}==========================================================${reset}`);
      } else badLoading();
    }, e => {
      error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Houve um erro ao fazer uma requisição na api para buscar todos os comandos!\n' +
        `> Path: "${__filename}"\n` +
        `> Erro: "${apiError(e)}"`
      );

      badLoading();
    });

  function load(commands) {
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
              
              if (!commandApi && auth) {
                api.put('/commands/create', {
                  name: cmdConfig.name,
                  aliases: cmdConfig.aliases,
                  type: cmdConfig.type,
                  description: cmdConfig.description,
                  how_to_use: cmdConfig.how_to_use,
                  cooldown: cmdConfig.cooldown,
                  example: cmdConfig.example,
                  example_url: cmdConfig.example_url,
                  created_timestamp: cmdConfig.created_timestamp,
                  updated_timestamp: cmdConfig.updated_timestamp,
                  version: cmdConfig.version,
                  releases_notes: cmdConfig.releases_notes,
                  times_limit: cmdConfig.times_limit,
                  active: cmdConfig.active ? 1 : 0,
                  reason_inactivity: cmdConfig.reason_inactivity
                }, {
                  headers: {
                    Authorization: `Bearer ${apiAuthToken}`
                  }
                })
                  .then(created => logger(
                    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
                    '> Novo comando criado no banco de dados!\n' +
                    `> Criado: ${JSON.stringify(created.data, null, 2)}`
                  ), e => error(
                    `> ${emoji.emojicoffeeerro} Erro!\n` +
                    '> Um comando não foi criado no banco de dados!\n' +
                    `> Comando que deveria ser criado: ${JSON.stringify(cmdConfig, null, 2)}\n` +
                    `> Path: "${__filename}"\n` +
                    `> Erro: "${apiError(e)}"`
                  ));
              } else if (commandApi) {
                command.config.cooldown = commandApi.cooldown;
                command.config.times_limit = commandApi.times_limit;
                command.config.active = commandApi.active === 1;
                command.config.reason_inactivity = commandApi.reason_inactivity;
              };
            };

            client.commands.set(cmdConfig.name, command);

            console.log(`Comando ${cyan}${cmdConfig.name.toUpperCase()}${reset} carregado com sucesso!`);
          });
      });
  };

  function badLoading() {
    console.log(`${red}==================== LOADING COMMANDS (bad loading) ====================${reset}`);
    load();
    console.log(`${red}========================================================================${reset}`);
  };
};