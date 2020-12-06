const client = require("../..");
const bcrypt = require('bcryptjs');
const generateToken = require('../../functions/generateToken');

module.exports = async (req, res) => {
  const { id, password } = req.body;

  if (!id) return res.status(400).send({ message: 'Falta a propriedade "id"!' });
  if (!password) return res.status(400).send({ message: 'Falta a propriedade "password"!' });

  const user = client.db.cache.users[id];

  if (!user) return res.status(400).send({ message: 'Usuário não encontrado!' });
  if (!user.password) return res.status(400).send({ message: 'Usuário não registrado!' });
  if (!await bcrypt.compare(password, user.password)) return res.status(400).send({ error: 'Senha inválida!' });

  user.password = undefined;

  return res.send({ user, token: generateToken({ id: user.id }) });
};