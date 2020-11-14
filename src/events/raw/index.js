const client = require('../..');

module.exports = (data) => {
  if (data.t === 'MESSAGE_REACTION_ADD') {
    console.log(data.d);
  };
};