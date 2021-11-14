const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('../info.json') // Requerimento do arquivo config, que tem diversas informações pertinentes para o funcionamento do bot
const Data = new Date() // Salva o momento em que o bot foi iniciado
const intervalActivity = null // Starta a variável
const changeActivity = require('./utils/changeActivity') // Chama o arquivo que muda o presence do bot
const pad = require('./utils/pad.js') // Chama o arquivo que faz a função de pad
const { createCanvas, loadImage } = require('canvas')
const mysql = require('mysql') // Conexão com o MySQL
const connection = mysql.createConnection({
  // Cria conexão com o banco de dados
  database: config.mysqlDatabase,
  host: config.mysqlHost,
  user: config.mysqlUser,
  password: config.mysqlPassword,
  port: config.mysqlPort,
})
connection.connect((err) => {
  // Conecta com o banco de dados
  if (err) {
    console.error('Erro na conexão: ' + err.stack)
    connection.connect()
  }
})
require('./utils/verificadorDeValidade.js').intervaloVerificacao(
  connection,
  client
)
/* setInterval(() => { connection.query('SELECT 1') }, 20000); // De 20 em 20 segundos, chama uma query do banco de dados, para o servidor não fechar conexão */

// 0 = reset; 1 = black; 2 = red; 3 = green; 4 = yellow; 5 = roxo; 6 = magenta; 7 = cyan; 8 = white;
client.commands = new Discord.Collection() // Collection com os comandos do bot
client.reactCommands = new Discord.Collection() // Collection com os comandos por reação do bot
client.events = new Discord.Collection() // Collection dos eventos em que o bot está inscrito
require('./utils/setHandlerNames.js').run(client) // Executa o arquivo com a função de setar os nomes nos events, commands e reactCommands

client.on('ready', () => {
  client.events.get('ready').execute(client, intervalActivity, Data)
}) // Evento da largada do bot

client.on('guildCreate', (guild) => {
  client.events
    .get('guildCreate')
    .execute(client, guild, intervalActivity, Data, connection)
}) // Evento acionado quando o bot entra em um novo servidor

client.on('guildDelete', (guild) => {
  client.events
    .get('guildDelete')
    .execute(client, guild, intervalActivity, Data, connection)
}) // Evento acionado quando o bot sai de algum servidor

client.on('message', async (message) => {
  client.events.get('message').execute(client, message, connection)
}) // Evento acionado quando alguém manda alguma mensagem no chat

client.on('guildMemberAdd', async (member) => {
  client.events.get('guildMemberAdd').execute(client, member, connection)
})

client.on('messageReactionAdd', async (message, user) => {
  client.events
    .get('messageReactionAdd')
    .execute(client, message, user, connection)
}) // Evento acionado quando algum usuário adiciona uma reação em uma mensagem

client.on('error', (error) => {
  client.events.get('error').execute(client)
}) // Evento acionado quando o bot se depara com algum erro

process.on('unhandledRejection', (reason) => {
  require('./utils/processEvents.js').ur(reason, client)
}) // Evento acionado quando o processo de execução se depara com um erro de rejeição

process.on('warning', (warning) => {
  require('./utils/processEvents.js').wa(warning, client)
}) // Evento acionado quanto o processo dispara um alerta

client.login(config.token) // Login do bot com o token
