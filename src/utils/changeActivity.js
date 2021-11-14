module.exports = {
  async run(intervalActivity, client, Data) { // Função que muda o que o bot exibe no "Activity" a cada 20 segundos
    const pad = require('./pad.js')
    let activityId = 0
    if (intervalActivity !== null) { // Toda vez que a função for chamada (exceto a primeira) o interval vai ser parado
      clearInterval(intervalActivity)
    }
    intervalActivity = setInterval(() => { // É iniciado o interval
      switch (activityId) { // Para cada activityId é executado um setActivity() diferente e adicionado +1 no activityId
        case 0:
          client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`, { type: "STREAMING", url: "https://github.com/joaoscoelho/Coffee" });
          activityId = 1;
          break;
        case 1:
          client.user.setActivity(`Temos ${client.users.cache.size} usuários`, { type: "STREAMING", url: "https://github.com/joaoscoelho/Coffee" });
          activityId = 2;
          break;
        case 2:
          client.user.setActivity(`Estou a ${(((new Date()) - (Data.getTime())) / 60000).toFixed(0)}m ativo`, { type: "STREAMING", url: "https://github.com/joaoscoelho/Coffee" });
          activityId = 3;
          break;
        case 3:
          const Hora = new Date
          client.user.setActivity(`Hora ${pad.pad((Hora.getUTCHours() < 3) ? Hora.getUTCHours() + 21 : Hora.getUTCHours() - 3, 2)}:${pad.pad(Hora.getUTCMinutes(), 2)}`, { type: "STREAMING", url: "https://github.com/joaoscoelho/Coffee" });
          activityId = 0;
          break;
        default:
          client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`, { type: "STREAMING", url: "https://github.com/joaoscoelho/Coffee" });
          activityId = 0;
      }
    }, 20000); // 20000ms == 20s
  }
}