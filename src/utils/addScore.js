let scores = require('../tempScores.json'); // JSON onde fica salvo a pontuação dos users até o momento de mandar esses pontos para o banco de dados
let stts = 'aberto'; // Variável que serve apenas para que o intervalo que chama a função de por os dados no db não seja aberto diversas vezes

module.exports = {
  async addScore(message, connection, user) { // Função que é chamada pelos arquivos externos e que salva os dados temporários dos usuários
    scores[message.guild.id + '-' + user.id] !== undefined ? scores[message.guild.id + '-' + user.id] += 1 : scores[message.guild.id + '-' + user.id] = 1 // Verifica se já existe um dado daquele user naquele servidor, caso tenha, adiciona 1 naquela propriedade, se não existir, cria e coloca 1 de valor
    if(!stts.includes('fechado')) { // Verifica se existe 'fechado' na variável stts
      setInterval(() => { // Abre o intervalo que chama a função de salvar o score no db a cada 50s
        this.saveScore(connection, Object.keys(scores), Object.values(scores))
      }, 50000)
      stts += 'fechado' // Adiciona 'fechado' à variável stts e impossibilita que esse intervalo seja chamado novamente, a menos que o bot seja reiniciado
    }
  },

  async saveScore(connection, keysScores, valuesScores) { // Função que salva os scores no database
    connection.query(`select id, serverid, userid, score from score_per_server order by serverid, userid`, async (err, result) => { // Query que pega as informações do banco de dados para verificar se vai ser necessário apenas um update ou um insert into
      if (err) throw err // Caso tenha algum erro, retorna o erro
      const serverUserId = result.map(x => x.serverid+'-'+x.userid) // Guarda num array a concatenação de serverid-userid de todos os registros o banco
      const precisaInsertIntoSU = keysScores.filter(x => !serverUserId.includes(x)) // Filtra do resultado que veio dos dados em cache, apenas aqueles que não existem no banco de dados
      const precisaInsertIntoSUS = precisaInsertIntoSU.map(x => x+'-'+valuesScores[precisaInsertIntoSU.indexOf(x)]) // Pega os dados filtrados acima e cria um array dos dados concatenados da seguinte maneira: 'serverid-userid-pontosEmCache'
      let insertSql = ''; // Starta  variável que vai conter parte de query de insert into
      for(let i = 0; i < precisaInsertIntoSUS.length; i++) { // Faz um loop com todos os itens do array de dados concatenados 'serverid-userid-pontos'
        const server = precisaInsertIntoSUS[i].split('-')[0] // Corta apenas o serverid do item na posição em que se encontra o i
        const user = precisaInsertIntoSUS[i].split('-')[1] // Corta apenas o userid || ||
        const pontos = precisaInsertIntoSUS[i].split('-')[2] // Corta apenas a pontuação || ||
        if(i === precisaInsertIntoSUS.length-1) { // Caso seja a ultima passagem do loop, ele adiciona uma parte da query que não ai receber continuação
          insertSql += `('${server}', '${user}', '${pontos}')`
        } else { // Caso contrário, adiciona pedaços da query preparados para vir outros a frente
          insertSql += `('${server}', '${user}', '${pontos}'), `
        }
      }
      if(insertSql) { // Caso o insertSql não esteja vazio (houveram casos que precisam de insert into) ele faz a query de inserir os dados daquelas pessoas no banco de dados
        await connection.query(`insert into score_per_server (serverid, userid, score) values ${insertSql}`) // Query de inserir os registros
        scores = {} // Reseta os dados em 'cache'
        return;
      }
      let keysValuesScores = [] // starta o array de dados concatenados 'serverid-userid-pontos'
      for(let i = 0; i < keysScores.length; i++) { // Faz um loop pelos itens que vieram do 'cache'
        keysValuesScores.push(keysScores[i]+'-'+valuesScores[i]) // Adiciona no array a cada passada do loop
      }
      keysValuesScores = keysValuesScores.sort() // Ordena os dados do array criado no loop acima
      const ids = result.filter(x => keysScores.includes(x.serverid+'-'+x.userid)).map(x => x.id) // Pega os ids dos registros que têm os userid-serverid iguais aos recebidos do 'cache'
      const score = result.filter(x => keysScores.includes(x.serverid+'-'+x.userid)).map(x => x.score) // Pega os scores dos registros || ||
      let updateSql = '' // Starta a variável que cria parte da query de update
      for(let i = 0; i < ids.length; i++) { // Faz um loop pelos registros que precisam update
        const newScore = score[i]+(Number(keysValuesScores[i].split('-')[2])*3) // Calcula qual vai ser a nova pontuação que deve ser setada no registro daquele usuário
        if(i === ids.length-1) {
          updateSql += `when ${ids[i]} then '${newScore}' end where id in (${ids.join(', ')})`
        } else {
          updateSql += `when ${ids[i]} then '${newScore}' `
        }
      }
      if(updateSql) { // Se a variável updateSql não estiver vazia, executa a query de update e reseta o 'cache'
        await connection.query(`update score_per_server set score = case id ${updateSql}`)
        scores = {}
      }
    })
  }
}