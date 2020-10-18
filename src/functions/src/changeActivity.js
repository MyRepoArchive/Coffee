const { client } = require('..');
const api = require('../../services/api');

let intervalActivity;
let i = 0;

module.exports = async () => { // Função que muda o que o bot exibe no "Activity" a cada 20 segundos
  const defaultActivities = [
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
      name: `Estou a ${parseInt((Date.now() - client.uptime) / 60000)} horas ativo`,
      type: 'STREAMING',
      url: null
    },
  ];
  
  if (!intervalActivity) clearInterval(intervalActivity); // Toda vez que a função for chamada (exceto a primeira) o interval vai ser parado

  const personalizedActivities = (await api.get('/activities')).data;

  const activities = personalizedActivities.filter(activity => activity.important === 1).length > 0 ?
    personalizedActivities.filter(activity => activity.important === 1) :
    personalizedActivities.concat(defaultActivities);

  intervalActivity = setInterval(() => { // Alterna o presence do bot a cada 20s
    if (i < activities.lengt) {
      client.user.setActivity(activities[i].name, { type: activities[i].type, url: activities[i].url });
      i++;
    } else {
      client.user.setActivity(activities[0].name, { type: activities[0].type, url: activities[0].url });
      i = 0;
    }
  }, 20000); // 20000ms == 20s
};