const { reset, yellow, cyan, red } = require('../../utils/Console');
const fs = require('fs');
const client = require('../..');
const Discord = require('discord.js');

module.exports = () => {
  // Collections com os comandos do bot
  client.commands = new Discord.Collection();

  if (cache.commands && Object.keys(cache.commands).length) {
    console.log(`${yellow}==================== LOADING COMMANDS ====================${reset}`);
    load(cache.commands); // Carrega os comandos normalmente com os comandos buscados da API
    console.log(`${yellow}==========================================================${reset}`);
  } else {
    console.log(`${red}==================== LOADING COMMANDS (bad loading) ====================${reset}`);
    load(); // Carrega os comandos apenas do que já tem nos próprios arquivos (faz um mal carregamento de comandos)
    console.log(`${red}========================================================================${reset}`);
  }

  function load(commands) {
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
                cache.commands[cmdConfig.name] = cmdConfig; // Se o comando ainda não tiver sido criado na API, ele cria um novo com as config padrão
              } else {
                // Coloca no comando local as variáveis que vieram do banco de dados
                command.config.cooldown = commandDb.cooldown;
                command.config.times_limit = commandDb.times_limit;
                command.config.active = commandDb.active;
                command.config.reason_inactivity = commandDb.reason_inactivity || null;

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
                ].forEach(prop => cache.commands[cmdConfig.name][prop] = cmdConfig[prop])
              };
            };

            client.commands.set(cmdConfig.name, command); // Carrega o comando no bot

            console.log(`Comando ${cyan}${cmdConfig.name.toUpperCase()}${reset} carregado com sucesso!`);
          });
      });
  };
};