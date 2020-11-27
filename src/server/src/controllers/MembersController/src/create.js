const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { members } = req.body;

  if (!members) return res.status(400).send({ error: msgs.missProps });
  if (typeof members !== "object") return res.status(400).send({ error: msgs.notArray });
  if (!members.length) return res.status(400).send({ error: msgs.emptyArray });
  if (members.find(member => !member.server || !member.user)) return res.status(400).send({ error: msgs.missPropsInAnItem });

  members.forEach((member, index) => {
    if (!member.score || typeof member.score !== "number") members[index].score = 0;
    if (!member.money || typeof member.money !== "number") members[index].money = 0;
    member.timestamp = Date.now();
  });

  const sql = `INSERT INTO members (server, user, score, money, timestamp) VALUES ${members.map(member => {
    return `('${member.server}', '${member.user}', '${member.score}', '${member.money}', '${member.timestamp}')`;
  }).join(', ')}`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.createErr, sqlError: err });

    members.forEach((member, index) => members[index].id = result.insertId + index);

    if (cache.members.length) cache.members.push(...members);

    return res.json({ result, sql, members });
  });
};