const client = require('../..');
const api = require('../../services/api');
const { static: { emoji } } = require('../../utils/emojis.json');

let intervalActivity;
let i = 0;

module.exports = () => { // Função que muda o que o bot exibe no "Activity" a cada 20 segundos
  const { error, apiError } = require('..');

  const defaultActivities = () => [
    {
      name: `Estou em ${client.guilds.cache.size} servidores`,
      type: 'STREAMING',
      url: null
    },
    {
      name: `Tenho ${client.users.cache.size} usuários`,
      type: 'STREAMING',
      url: null
    },
    {
      name: `Estou a ${parseInt(client.uptime / 3600000)} horas ativo`,
      type: 'STREAMING',
      url: null
    },
  ];

  if (!intervalActivity) clearInterval(intervalActivity); // Toda vez que a função for chamada (exceto a primeira) o interval vai ser parado

  api.get('/activities')
    .then(({ data }) => {
      intervalActivity = setInterval(() => { // Alterna o presence do bot a cada 20s
        const activities = data.filter(activity => activity.important === 1).length ?
        data.filter(activity => activity.important === 1) :
        data.concat(defaultActivities());
        
        if (i < activities.length) {
          client.user.setActivity(activities[i].name, { type: activities[i].type, url: activities[i].url });
          i++;
        } else {
          client.user.setActivity(activities[0].name, { type: activities[0].type, url: activities[0].url });
          i = 0;
        }
      }, 20000); // 20000ms == 20s
    }, e => error(
      `> ${emoji.emojicoffeeerro} Erro!\n`+
      '> Houve um erro ao buscar os activities da api!\n'+
      `> Path: ${__filename}\n`+
      `> Erro: ${apiError(e)}`
    ));
};