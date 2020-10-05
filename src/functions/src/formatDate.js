const pad = require('./pad.js')

module.exports = {
  async formatDate(date) { // Função que formata uma data para o formato (dd/mm/aaaa às hh:mm:ss)
    return `${pad.pad(date.getUTCDate(), 2)}/${pad.pad(date.getUTCMonth()+1, 2)}/${date.getUTCFullYear()} às ${pad.pad((date.getUTCHours() < 3) ? date.getUTCHours()+21 : date.getUTCHours()-3, 2)}:${pad.pad(date.getUTCMinutes(), 2)}:${pad.pad(date.getUTCSeconds(), 2)}`
  }
}