const { client } = require('../../index');
const activities = [
  `Estou em ${client.guilds.cache.size} servidores`,
  `Tenho ${client.users.cache.size} usuários`,
  `Estou a ${parseInt((Date.now() - client.uptime) / 60000)} horas ativo`,
]
let intervalActivity;
let i = 0;

module.exports = () => { // Função que muda o que o bot exibe no "Activity" a cada 20 segundos
  if (!intervalActivity) clearInterval(intervalActivity); // Toda vez que a função for chamada (exceto a primeira) o interval vai ser parado

  intervalActivity = setInterval(() => { 
    if(i < activities.lengt) {
      client.user.setActivity(activities[i], { type: "STREAMING" });
      i++;
    } else {
      client.user.setActivity(activities[0], { type: "STREAMING" });
      i = 0;
    }
  }, 20000); // 20000ms == 20s
}