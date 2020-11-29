const isEquivalent = require("./src/functions/src/isEquivalent");

console.log(isEquivalent({
  name: "joao",
  idade: 13,
  endereco: {
    bairro: "Alto da boa",
    rua: "corre nu",
    numero: 5,
    cidade: "Mairi",
    UF: "BA",
    centro: false
  },
  paulista: false,
  itens: [{
    name: "lavadora",
    potencia: 3000
  },
{
  name: "computador",
  potencia: 450
},
"butijão"]
}, require('./teste.json')));

console.log(['a'] === 'a')