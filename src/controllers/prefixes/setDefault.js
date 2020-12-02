const defaultPrefix = require('../../config/default.json').prefix;

module.exports = (prefixes) => Object.values(prefixes).forEach(prefix => prefix === undefined || prefix === null ? prefix = defaultPrefix : null);