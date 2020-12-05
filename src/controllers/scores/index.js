const client = require('../..');
const error = require('../../functions/error');
const getLevel = require('../../functions/getLevel');
const { static: { emoji } } = require('../../utils/emojis.json');
const joinProducts = require('../inventory/inventoryJoinProducts');
const membersUpdate = require('../members/update');

setInterval(() => {
  saveScore(client.db.cache.members, require('./scores'))
}, 60000); // 60 segundos

saveScore(client.db.cache.members, require('./scores'))

async function saveScore(members, scores) {
  const pointMultipliers = joinProducts().filter(item => {
    return item.active && item.product.type === 'point_multiplier';
  });

  const obj = {};

  Object.keys(scores).forEach(key => {
    if (members[key]) {
      const pointMultiplier = pointMultipliers.filter(item =>
        (item.scope === 'global' && item.user === userId) ||
        (item.scope === 'local' && item.user === userId && item.server === serverId)
      );
      const multiplier = pointMultiplier.length ?
        pointMultiplier.reduce((prev, curr) => prev.product.point_multiplier += curr.product.point_multiplier) : 1;
      const level = getLevel(members[key].score);
      const value = Math.round(scores[key] * (level * 0.5) * multiplier + members[key].score);

      console.log(scores[key], level, value, members[key].score)
      obj[key] = members[key];
      obj[key].score = value;
    } else {
      obj[key] = { score: scores[key] };
    };
  });

  if (Object.keys(obj).length) {
    await membersUpdate(obj, { orCreate: true }).catch(e => error(
      `> ${emoji.emojicoffeeerro} Erro!\n` +
      '> Houve um erro ao atualizar a pontuação dos usuários no banco de dados!\n' +
      `> Path: "${__filename}"\n` +
      `> Objeto: ${JSON.stringify(obj, null, 2)}\n` +
      `> Erro: ${e}`
    ));

    Object.keys(scores).forEach(key => delete scores[key]);
  };
};