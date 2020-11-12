const api = require('../../../services/api');
const { static: { emoji } } = require('../../../utils/emojis.json');
const cache = require('../../../utils/cache');

module.exports = async (members) => {
  const { error, apiError, logger } = require('../../../functions');
  
  api.get('/inventory', { body: { joinProducts: true } })
    .then(response => {
      const pointMultiplier = response.data.filter(item => item.active && item.type === 'point-multiplier');
      const needCreate = [];
      const needUpdate = [];

      Object.keys(cache.scores).forEach(serverId => {
        if (members.map(member => member.server).includes(serverId)) {
          const serverMembers = members.filter(member => member.server === serverId);

          Object.keys(cache.scores[serverId])
            .forEach(userId => {
              if (!serverMembers.map(member => member.user).includes(userId)) {
                needCreate.push({ server: serverId, user: userId, score: cache.scores[serverId][userId] });
              } else {
                const member = members.find(member => member.user === userId && member.server === serverId);
                const multiplier = pointMultiplier.filter(item => 
                  (item.scope === 'global' && item.user === userId) || 
                  (item.scope === 'local' && item.user === userId && item.server === serverId)
                ).length ? pointMultiplier.filter(item => 
                  (item.scope === 'global' && item.user === userId) || 
                  (item.scope === 'local' && item.user === userId && item.server === serverId)
                ).reduce((prev, curr) => prev.characteristics.point_multiplier += curr.characteristics.point_multiplier) : 1;
  
                const value = cache.scores[serverId][userId] * multiplier + member.score;
  
                needUpdate.push({ id: member.id, value });
              };
            });
        } else {
          Object.keys(cache.scores[serverId]).forEach(userId => needCreate.push({ server: serverId, user: userId, score: cache.scores[serverId][userId] }));
        };
      });

      if (needCreate.length) api.put('/members/create', { members: needCreate })
        .then(res => {
          logger(
            `> ${emoji.emojicoffeeinfo} Aviso!\n` +
            '> Novos membros foram criados no banco de dados!\n' +
            `> Os membros: ${JSON.stringify(res.data.members, null, 4)}` 
          );
          needCreate.splice(0, needCreate.length);
        }, e => error(
          `> ${emoji.emojicoffeeerro} Erro!\n` +
          '> Alguns membros não foram criados na API!\n' +
          `> Path: "${__filename}"\n` +
          `> Os membros: ${JSON.stringify(needCreate, null, 4)}\n` +
          `> Erro: "${apiError(e)}"`
        ));

      if (needUpdate.length) api.post('/members/update', { members: { score: needUpdate } })
        .then(res => {
          logger(
            `> ${emoji.emojicoffeeinfo} Aviso!\n` +
            '> Foram atualizadas as pontuações de alguns membros!\n' +
            `> As pontuações: ${JSON.stringify(needUpdate, null, 4)}`
          );
          needUpdate.splice(0, needUpdate.length);
        }, e => error(
          `> ${emoji.emojicoffeeerro} Erro!\n` +
          '> Pontuações de alguns membros não foram atualizadas!\n' +
          `> Path: "${__filename}"\n` +
          `> As pontuações: ${JSON.stringify(needUpdate, null, 4)}\n` +
          `> Erro: "${apiError(e)}"`
        ));
      
      cache.scores = {};
    });
};