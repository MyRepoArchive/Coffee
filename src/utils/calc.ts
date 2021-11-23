import { GuildChannel, Message } from 'discord.js'
import { Bot } from '../shared/Bot'
const math = require('mathjs')

export default async function calc({
  message,
  bot,
}: {
  message: Message
  bot: Bot<true>
}) {
  if (!(message.channel instanceof GuildChannel)) return

  const dbChannel = bot.database.channels.cache.get(message.channel.id)

  if (!dbChannel) bot.database.channels.syncWithDiscord()

  const calcAllowed = dbChannel?.calc_allowed.value ?? true

  if (!calcAllowed) return

  message.content = message.content
    .toLowerCase()
    .replace('**', '^')
    .replace('×', '*')
    .replace('÷', '/')
    .replace('π', 'pi')
    .replace(':', '/')

  /* const notIsNumber = message.content
    .split(/\d+/g)
    .join('')
    .split(/[/*.()+%-]/)
    .join('')
    .split(' ')
    .filter((x) => x !== '') // Pega o conteúdo da mensagem e divide todas as parte que forem números, depois, tudo o que for sinal, por fim divide todos os espaços e joga tudo isso que não for núnero, sinal ou espaço e joga em um array */

  const numbers = message.content.split(/\D+/g).filter((x) => x !== '') // Coloca em um array todos os números do conteúdo da mensagem

  /* const sinais = message.content.split(/[^/*+.()%-]/).filter((x) => x !== '') // Coloca em um array todos os sinais "/", "*", "%", "+", e "-" que tiverem no conteúdo da mensagem

  const importantSinais = message.content
    .split(/[^/*+%-]/)
    .filter((x) => x !== '') // Vê se na mensagem há algum sinal importante e coloca num array */

  /* if(sinais.length === 0 || numbers.length === 0 || notIsNumber.length !== 0)return; */ // Verifica se a mensagem não tem sinais, ou números e se na mensagem há algo que não seja número, caso a resposta para alguma dessas verificações seja positiva, ele não prossegue.
  if (message.content.startsWith('-') && numbers.length === 1) return // Verifica se o número inicial é negativo e se há apenas ele na mensage, caso sim, retorna
  if (message.content.startsWith('(') && numbers.length === 1) return
  if (Number(message.content)) return

  const limitedEvaluate = math.evaluate
  /* math.import = function (): any {}
  math.createUnit = function (): any {}
  math.parse = function (): any {}
  math.simplify = function (): any {}
  math.derivative = function (): any {}
  math.format = function (): any {} */

  let result // Starta a variável result
  try {
    // Tenta realizar um eval() do conteúdo da mensagem, caso aconteca algum erro, ele retorna
    result = await limitedEvaluate(message.content)
  } catch (e) {
    return
  }
  if (typeof result !== 'number') return // Se o resultado do eval não for um número, retorna
  if (result === Infinity || result === -Infinity || isNaN(result))
    result = 'Não é possível determinar'
  message.channel.send(`\`\`\`${result}\`\`\``).catch(() => {}) // Se poder enviar mensagens naquele canal, ele envia o resultado do eval
}

/* export async function semelhancaStrings(message, client, connection) {
  const getCalcConfig = await require('../utils/getChannelOptions.js').getCacheCalc(connection, message.channel, message.guild)
  if(!getCalcConfig.canalAtual)return
  if(!message.channel.memberPermissions(message.guild.me).has("SEND_MESSAGES"))return;
  const string1 = message.content.split('~=')[0].trim()
  const string2 = message.content.split('~=')[1].trim()
  const semelhanca = levenshteinDistance(string1, string2)
  if(semelhanca >= 100)return message.channel.send(`\`\`\`1% de semelhança\`\`\``);
  const nivelSemelhanca = 100-semelhanca
  message.channel.send(`\`\`\`${nivelSemelhanca}% de semelhança\`\`\``)
} */
