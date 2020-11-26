const { static: { eID } } = require('../../../../utils/emojis.json');
const deleteEval = require('./deleteEval');
const saveEval = require('./saveEval');
const sendDmEval = require('./sendDmEval');

module.exports = (msg, message, evalContent, embed) => {
  const emojis = [eID.emojicoffeetrashrecycling, eID.emojicoffeesave, eID.emojicoffeeenveloppe];

  msg.createReactionCollector((react, user) => emojis.includes(react.emoji.id) && user.id === message.author.id, { time: 600000 })
    .on('collect', async (react) => {
      switch (react.emoji.id) {
        // Coletor para apagar o conteúdo do eval! 
        case emojis[0]: 
          deleteEval(msg);
          break;

        // Coletor para salvar o conteúdo do eval!
        case emojis[1]: 
          saveEval(message, evalContent, embed);
          break;

        // Coletor para enviar o eval na dm do usuário
        case emojis[2]: 
          sendDmEval(message, embed);
          break;
      };
    });
};