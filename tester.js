const isEquivalent = require("./src/functions/src/isEquivalent");

async function teste() {
  console.log(await isEquivalent({ b: { b: { b: 'name' } } }, { b: 'name' }))
};

teste()