const { static: { emoji, eID } } = require('../../../../utils/emojis.json');

module.exports = () => new Promise ((resolve, reject) => {
  const msg = 
    `> ${emoji.emojicoffeecheck} Check!\n\n`+
    '> Seu report foi enviado para os administradores, eles irão verificar se é válido e irão corrigir o mais rápido possível, obrigado!\n'+
    '> Status: "Em análise"'
})