module.exports = (path) => {
  if (/^commands$/g.test(path)) return require('../models/commands')
  else if (/^commands\/(\d*[a-z]+)[\d_a-z]*$/g.test(path)) return require('../models/commands/command')
  else if (/^commands\/(\d*[a-z]+)[\d_a-z]*\/releases_notes$/g.test(path)) return require('../models/commands/command/releases_notes')
  else if (/^commands\/(\d*[a-z]+)[\d_a-z]*\/aliases$/g.test(path)) return require('../models/commands/command/aliases')
};