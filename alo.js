module.exports = {
  name: 0,
  aliases: ["ola", "tudo bem"]
};

module.exports.load = () => {
  module.exports.name++;
  console.log('carregado')
};
module.exports.load();