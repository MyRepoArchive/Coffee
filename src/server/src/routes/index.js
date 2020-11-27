const app = require('../..');

// Rotas
app.use('/api/activities',  require('./src/activities'));
app.use('/api/auth', require('./src/auth'));
app.use('/api/cache', require('./src/cache'));
app.use('/api/channels', require('./src/channels'));
app.use('/api/commands', require('./src/commands'));
app.use('/api/inventory', require('./src/inventory'));
app.use('/api/members', require('./src/members'));
app.use('/api/products', require('./src/products'));
app.use('/api/register', require('./src/register'));
app.use('/api/reports', require('./src/reports'));
app.use('/api/servers', require('./src/servers'));
app.use('/api/suggestions', require('./src/suggestions'));
app.use('/api/users', require('./src/users'));

module.exports = app;