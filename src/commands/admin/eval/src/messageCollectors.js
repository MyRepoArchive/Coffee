const deleteEval = require('./deleteEval');
const saveEval = require('./saveEval');
const sendDmEval = require('./sendDmEval');


module.exports = async (message, evalContent, mensagem, embed) => {
  const messages = [`!deval`, `!saveeval`, `!sendeval`];

  // Coletor no canal do servidor
  message.channel.createMessageCollector(msg => messages.includes(msg.content) && msg.author.id === message.author.id, { time: 1200000 })
    .on('collect', msg => {
      switch (msg.content) {
        // Coletor que apaga o eval
        case messages[0]: 
          deleteEval(mensagem);
          break;
        
        // Coletor que salva o eval
        case messages[1]:
          saveEval(message, evalContent, embed);
          break;
        
        // Coletor que envia o eval na dm
        case messages[2]:
          sendDmEval(message, embed);
          break;
      };
    });

  const dm = await message.author.createDM();
  // Coletor na dm do usuário
 dm.createMessageCollector(msg => messages.includes(msg.content), { time: 1200000 })
    .on('collect', msg => {
      switch (msg.content) {
        // Coletor que apaga o eval
        case messages[0]: 
          deleteEval(mensagem);
          break;
        
        // Coletor que salva o eval
        case messages[1]:
          saveEval(message, evalContent, embed);
          break;
        
        // Coletor que envia o eval na dm
        case messages[2]:
          sendDmEval(message, embed);
          break;
      };
    })
};