const defaultPrefix = require('../../config/default.json').prefix;

module.exports = (prefixes) => Object.values(prefixes).forEach((prefix, index) => prefix === undefined || prefix === null ? prefixes[Object.keys(prefixes)[index]] = defaultPrefix : null);