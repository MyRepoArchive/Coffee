const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "calculator",
  type: "Geral",
  description: "Calculadora para quando você precisar fazer uma conta rápida\nModo de usar:\n**Soma:** *3+3* `6`\n**Subtração:** *2-3* `-1`\n**Multiplicação:** _2*5_ `10`\n**Divisão:** *50 / 2* `25`\n**Resto da divisão (módulo):** *100 % 3* `1`\n**Potência:** _5 **5_ `25`",
  
  async execute(message, args, comando, client) {
    
  },

  async calc(message) {
    const notIsNumber = message.content.split(/\d+/g).join('').split(/[/*+%-]/).join('').split(' ') // Tudo o que estiver no conteúdo da mensagem que não for número nem sinal de operação
    while(notIsNumber.indexOf('') >= 0) { notIsNumber.splice(notIsNumber.indexOf(''), 1) } // retira os '' da const acima
    const numbers = message.content.split(/\D+/g) // Coloca em um array todos os números do conteúdo da mensagem
    const sinais = message.content.split(/[^/*+%-]/) // Coloca em um array todos os sinais "/", "*", "%", "+", e "-" que tiverem no conteúdo da mensagem
    while(numbers.indexOf('') >= 0) { numbers.splice(numbers.indexOf(''), 1) } // Tira os '' do array de numeros
    while(sinais.indexOf('') >= 0) { sinais.splice(sinais.indexOf(''), 1) } // Tira os '' do array de sinais
    if(sinais.length === 0 || numbers.length === 0 || notIsNumber.length !== 0)return; // Verifica se a mensagem não tem sinais e se na mensagem há algo que não seja número
    if(message.content.startsWith('-') && numbers.length === 1)return;
    let result;
    try {
      result = await eval(message.content)
    } catch (e) {
      return;
    }
    if(typeof(result) != "number")return;
    message.channel.send(`\`\`\`${result}\`\`\``)
  }
}