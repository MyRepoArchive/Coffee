module.exports = (number, width) => {
    number += '' // Transforma o número em uma String
    return number.length >= width ? number : new Array(width - number.length + 1).join('0') + number;
}