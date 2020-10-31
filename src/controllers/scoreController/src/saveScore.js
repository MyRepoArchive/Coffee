const { scores } = require('../../../utils/cache.json');
const api = require('../../../services/api');
const { static: { emoji } } = require('../../../utils/emojis.json');

module.exports = async (response) => {
  const { error, apiError, comprasJoinProducts } = require('../../../functions');
  const { apiAuthToken } = require('../../../config/auth.json');
  const purchases = await comprasJoinProducts()
  const usersPS = response.data
  const localPointMultipliers = purchases.locais.filter(purchase => purchase.active && purchase.p_type === 'point-multiplier');
  const globalPointMultipliers = purchases.globais.filter(purchase => purchase.active && purchase.p_type === 'point-multiplier');
  const existingServers = Object.keys(scores).filter(serverId => usersPS.map(user => user.server_id).includes(serverId));
  const nonexistingServers = Object.keys(scores).filter(serverId => !usersPS.map(user => user.server_id).includes(serverId));
  const needCreate = [];
  const needUpdate = [];

  existingServers.forEach(serverId => {
    const registersOfServer = usersPS.filter(user => user.server_id === serverId);

    Object.keys(scores[serverId])
      .filter(userId => !registersOfServer.map(user => user.user_id).includes(userId))
      .forEach(userId => needCreate.push({ serverId, userId }));

    Object.keys(scores[serverId])
      .filter(userId => registersOfServer.map(user => user.user_id).includes(userId))
      .forEach(userId => {
        const user = usersPS.find(user => user.server_id === serverId && user.user_id === userId);
        const localPointMultiplier = localPointMultipliers
          .find(purchase => purchase.server_id === serverId && purchase.user_id === userId) || { p_point_multiplier: 1 };
        const globalPointMultiplier = globalPointMultipliers
          .find(purchase => purchase.user_id === userId) || { p_point_multiplier: 1 };
        const value = scores[serverId][userId] * localPointMultiplier.p_point_multiplier * globalPointMultiplier.p_point_multiplier + user.score;

        needUpdate.push({ value, id: user.id });
      });
  });

  nonexistingServers.forEach(serverId => {
    Object.keys(scores[serverId]).forEach(userId => needCreate.push({ serverId, userId }));
  });

  if (needCreate.length) {
    api.put('/userPerServer/bulkCreate', { serversAndUsersIds: needCreate }, { headers: { Authorization: `Bearer ${apiAuthToken}` } })
      .then(response => response.data.forEach(userPS => {
        scores[userPS.server_id][userPS.user_id] = undefined;
      }), e => error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Houve um erro ao criar novos user_per_server!\n' +
        `> Path: ${__filename}\n` +
        `> Erro: ${apiError(e)}`
      ));
  };

  if (needUpdate.length) {
    api.post('/userPerServer/bulkUpdate', { 
      property: 'score', valuesAndIds: needUpdate
    },
    {
      headers: { Authorization: `Bearer ${apiAuthToken}` } 
    })
      .then(response => response.data.forEach(userPS => {
        scores[userPS.server_id][userPS.user_id] = undefined;
      }), e => error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Houve um erro ao atualizar a pontuação de alguns user_per_server!\n' +
        `> Path: ${__filename}\n` +
        `> Erro: ${apiError(e)}`
      ));
  };
};