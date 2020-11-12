const api = require('../../services/api');
const { reset, yellow, cyan, red } = require('../../utils/Console');
const fs = require('fs');
const { static: { emoji } } = require('../../utils/emojis.json');
const client = require('../..');
const Discord = require('discord.js');

module.exports = () => {
  // Collections com os comandos do bot
  client.commands = new Discord.Collection();

  const { logger, apiError, error, isEquivalent } = require('..');

  api.get('/commands')
    .then(response => {
      console.log(`${yellow}==================== LOADING COMMANDS ====================${reset}`);
      load(response.data);
      console.log(`${yellow}==========================================================${reset}`);
    }, e => {
      error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Houve um erro ao fazer uma requisição na api para buscar todos os comandos!\n' +
        `> Path: "${__filename}"\n` +
        `> Erro: "${apiError(e)}"`
      );

      console.log(`${red}==================== LOADING COMMANDS (bad loading) ====================${reset}`);
      load();
      console.log(`${red}========================================================================${reset}`);
    });

  function load(commands) {
    const needCreate = [];
    const needUpdate = {};

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
                needCreate.push(cmdConfig);
              } else {
                command.config.cooldown = commandApi.cooldown;
                command.config.times_limit = commandApi.times_limit;
                command.config.active = commandApi.active === 1;
                command.config.reason_inactivity = commandApi.reason_inactivity;

                if (commandApi.aliases.length !== cmdConfig.aliases.length || cmdConfig.aliases.find((aliase, index) => aliase !== commandApi.aliases[index])) 
                  needUpdate.aliases ? needUpdate.aliases.push({ id: commandApi.id, value: cmdConfig.aliases }) : needUpdate.aliases = [{ id: commandApi.id, value: cmdConfig.aliases }];
                if (commandApi.type !== cmdConfig.type) 
                  needUpdate.type ? needUpdate.type.push({ id: commandApi.id, value: cmdConfig.type }) : needUpdate.type = [{ id: commandApi, value: cmdConfig.type }];
                if (commandApi.description !== cmdConfig.description)
                  needUpdate.description ? needUpdate.description.push({ id: commandApi.id, value: cmdConfig.description }) : needUpdate.description = [{ id: commandApi.id, value: cmdConfig.description }];
                if (commandApi.how_to_use !== cmdConfig.how_to_use)
                  needUpdate.how_to_use ? needUpdate.how_to_use.push({ id: commandApi.id, value: cmdConfig.how_to_use }) : needUpdate.how_to_use = [{ id: commandApi.id, value: cmdConfig.how_to_use }];
                if (commandApi.example !== cmdConfig.example)
                  needUpdate.example ? needUpdate.example.push({ id: commandApi.id, value: cmdConfig.example }) : needUpdate.example = [{ id: commandApi.id, value: cmdConfig.example }];
                if (commandApi.example_url !== cmdConfig.example_url)
                  needUpdate.example_url ? needUpdate.example_url.push({ id: commandApi.id, value: cmdConfig.example_url }) : needUpdate.example_url = [{ id: commandApi.id, value: cmdConfig.example_url }];
                if (commandApi.created_timestamp !== cmdConfig.created_timestamp)
                  needUpdate.created_timestamp ? needUpdate.created_timestamp.push({ id: commandApi.id, value: cmdConfig.created_timestamp }) : needUpdate.created_timestamp = [{ id: commandApi.id, value: cmdConfig.created_timestamp }];
                if (commandApi.updated_timestamp !== cmdConfig.updated_timestamp)
                  needUpdate.updated_timestamp ? needUpdate.updated_timestamp.push({ id: commandApi.id, value: cmdConfig.updated_timestamp }) : needUpdate.updated_timestamp = [{ id: commandApi.id, value: cmdConfig.updated_timestamp }];
                if (commandApi.version !== cmdConfig.version)
                  needUpdate.version ? needUpdate.version.push({ id: commandApi.id, value: cmdConfig.version }) : needUpdate.version = [{ id: commandApi.id, value: cmdConfig.version }];
                if (!isEquivalent(commandApi.releases_notes, cmdConfig.releases_notes))
                  needUpdate.releases_notes ? needUpdate.releases_notes.push({ id: commandApi.id, value: cmdConfig.releases_notes }) : needUpdate.releases_notes = [{ id: commandApi.id, value: cmdConfig.releases_notes }];
                
              };
            };

            client.commands.set(cmdConfig.name, command);

            console.log(`Comando ${cyan}${cmdConfig.name.toUpperCase()}${reset} carregado com sucesso!`);
          });
      });

    if (needCreate.length) {
      api.put('/commands/create', { commands: needCreate })
      .then(response => logger(
        `> ${emoji.emojicoffeeinfo} Aviso!\n` +
        '> Novos comandos criados no banco de dados!\n' +
        `> Criados: ${JSON.stringify(response.data.commands, null, 2)}`
      ), e => error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Alguns comandos não foram criados no banco de dados!\n' +
        `> Comandos que deveriam ser criados: ${JSON.stringify(needCreate, null, 2)}\n` +
        `> Path: "${__filename}"\n` +
        `> Erro: "${apiError(e)}"`
      ));
    };

    if (Object.keys(needUpdate).length) {
      api.post('/commands/update', { commands: needUpdate })
        .then(response => logger(
          `> ${emoji.emojicoffeeinfo} Aviso!\n` +
          '> Alguns commandos foram atualizados no banco de dados!\n' +
          `> Request: ${JSON.stringify(needUpdate, null, 4)}\n` +
          `> Resposta: ${JSON.stringify(response.data, null, 4)}`
        ), e => error(
          `> ${emoji.emojicoffeeerro} Erro!\n` +
          '> Alguns comandos não foram atualizados no banco de dados!\n' +
          `> Path: "${__filename}"\n` +
          `> Request: ${JSON.stringify(needUpdate, null, 4)}\n` +
          `> Erro: "${apiError(e)}"`
        ));
    };
  };
};