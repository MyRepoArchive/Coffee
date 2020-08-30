const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "calculator",
  type: "Geral",
  description: "Calculadora para quando você precisar fazer uma conta rápida",
  
  async execute(message, args, comando, client) {
    
  },

  async calc(message) {
    const notIsNumber = message.content.split(/\d+/g).join('').split(/[/*+%-]/).join('').split(' ') // Tudo o que estiver no conteúdo da mensagem que não for número nem sinal de operação
    while(notIsNumber.indexOf('') >= 0) { notIsNumber.splice(notIsNumber.indexOf(''), 1) } // retira os '' da const acima
    const numbers = message.content.split(/\D+/g) // Coloca em um array todos os números do conteúdo da mensagem
    const sinais = message.content.split(/[^/*+%-]/) // Coloca em um array todos os sinais "/", "*", "%", "+", e "-" que tiverem no conteúdo da mensagem
    while(numbers.indexOf('') >= 0) { numbers.splice(numbers.indexOf(''), 1) } // Tira os '' do array de numeros
    while(sinais.indexOf('') >= 0) { sinais.splice(sinais.indexOf(''), 1) } // Tira os '' do array de sinais
    if(sinais.length >= numbers.length || numbers.length !== sinais.length+1 || sinais.length === 0 || notIsNumber.length !== 0)return; // Verifica se a quantidade de sinais é maior 
    let i = 0
    let c = 1
    while(i < sinais.length) {
      numbers.splice(c, 0, sinais[i])
      c += 2
      i++
    }
    message.channel.send(`\`\`\`${eval(numbers.join(''))}\`\`\``)
  }
}