module.exports = {
  pad(number, width) { // Função para adicionar '0' à esquerda, para um número pequeno
    number += '' // Transforma o número em uma string
    return number.length >= width ? number : new Array(width - number.length + 1).join('0') + number; // Verifica se o tamanho do número é maior ou igual ao tamanho mínimo solicitado, caso seja, vai retornar o mesmo número, caso não seja, vai adicionar à esquerda do número os zeros que faltam
  }
}