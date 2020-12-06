module.exports = (req, res) => {
  if (typeof req.body.time === 'string') req.body.time = Number(req.body.time);
  if (typeof req.body.time !== 'number') 
    return res.status(400).send({ message: 'O parâmetro "time" deve ser um número ou uma string que possa ser convertida em um número!' });
  if (!isFinite(req.body.time)) return res.status(400).send({ message: 'O parâmetro "time" deve ser finito!' });

  require('../../../controllers/activities/setTime')(req.body.time).then(time => {
    res.send({ message: `Novo tempo setado!`, time });
  }, e => {
    res.status(500).send({ message: 'Houve um problema ao setar um novo tempo', erro: e })
  });
};