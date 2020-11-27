const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { activities } = req.body;

  if (!activities) return res.status(400).send({ error: msgs.missProps });
  if (typeof activities !== "object") return res.status(400).send({ error: msgs.notArray });
  if (!activities.length) return res.status(400).send({ error: msgs.emptyArray });
  if (activities.find(activity => !activity.name)) return res.status(400).send({ error: msgs.missPropsInAnItem });

  activities.forEach((activity, index) => {
    if (!activity.url) activities[index].url = null;
    if (!activity.type) activities[index].type = 'STREAMING';
    activity.important ? activities[index].important = 1 : activities[index].important = 0;
  });

  const sql = `INSERT INTO activities (name, type, url, important) VALUES ${activities.map(activity => {
    return `('${activity.name}', '${activity.type}', ${activity.url ? `'${activity.url}'` : null}, '${activity.important}')`;
  }).join(', ')}`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.createErr, sqlError: err });

    activities.forEach((activity, index) => activities[index].id = result.insertId + index);

    if (cache.activities.length) cache.activities.push(...activities);

    return res.json({ result, sql, activities });
  });
};