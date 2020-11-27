const db = require('../../../utils/connectDb'); // Conecta ao banco de dados;
const { addReq } = require('../../../functions');
const cache = require('../../../utils/cache');

module.exports = (req, res) => {
  addReq(1, 0);

  const { id } = req.body;

  if (!id) return res.status(400).send({ error: "Missing properties" });

  db.query('DELETE FROM user_per_server WHERE id = ?', [id], (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: "Error when deleting", sqlError: err });

    cache.userPerServer.forEach((ups, index) => id == ups.id && cache.userPerServer.splice(index, 1));

    return res.json(result);
  });
};