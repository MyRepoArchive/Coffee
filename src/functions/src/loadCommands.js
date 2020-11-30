const { reset, yellow, cyan, red } = require('../../utils/Console');
const fs = require('fs');
const client = require('../..');
const Discord = require('discord.js');
const create = require('../../controllers/create');
const { isEquivalent, logger, error } = require('..');
const { static: { emoji } } = require('../../utils/emojis.json');
const update = require('../../controllers/update');

module.exports = () => {
  // Collections com os comandos do bot
  client.commands = new Discord.Collection();

  if (client.db.cache.commands && Object.keys(client.db.cache.commands).length) {
    console.log(`${yellow}==================== LOADING COMMANDS ====================${reset}`);
    load(client.db.cache.commands); // Carrega os comandos normalmente com os comandos buscados da API
    console.log(`${yellow}==========================================================${reset}`);
  } else {
    console.log(`${red}==================== LOADING COMMANDS (bad loading) ====================${reset}`);
    load(); // Carrega os comandos apenas do que já tem nos próprios arquivos (faz um mal carregamento de comandos)
    console.log(`${red}========================================================================${reset}`);
  }

  function load(commands) {
    const createObj = {};
    const updtObj = {};

    fs.readdirSync('./src/commands', { withFileTypes: true }) // Lê a pasta commands
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
              const commandDb = commands[cmdConfig.name];

              if (!commandDb) {
                createObj[cmdConfig.name] = cmdConfig;
              } else {
                // Coloca no comando local as variáveis que vieram do banco de dados
                ['cooldown', 'times_limit', 'active', 'reason_inactivity'].forEach(prop => {
                  command.config[prop] = commandDb[prop] === undefined ? null : commandDb[prop];
                });

                [
                  "aliases",
                  "type",
                  "description",
                  "example",
                  "example_url",
                  "created_timestamp",
                  "updated_timestamp",
                  "version",
                  "releases_notes"
                ].forEach(prop => {
                  if (!isEquivalent(cmdConfig[prop], commandDb[prop])) updtObj[cmdConfig.name] = cmdConfig;
                });
              };
            };

            client.commands.set(cmdConfig.name, command); // Carrega o comando no bot

            console.log(`Comando ${cyan}${cmdConfig.name.toUpperCase()}${reset} carregado com sucesso!`);
          });
      });

    if (Object.keys(createObj).length) {
      create('commands', createObj).then(e => error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Erro ao criar comando na API\n' +
        `> Path: "${__filename}"\n` +
        `> Erro: "${JSON.stringify(e, null, 2)}"`
      )); // Se o comando ainda não tiver sido criado na API, ele cria um novo com as config padrão
    };
    if (Object.keys(updtObj).length) {
      update('commands', updtObj).catch(e => error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Erro ao atualizar comandos'
      ))
    };
  };
};