const { mysqlDatabase, mysqlHost, mysqlUser, mysqlPassword, mysqlPort } = require('../../config/auth.json');
const mysql = require('mysql');

const mysqlDb = mysql.createConnection({ // Cria conexão com o banco de dados
    database: mysqlDatabase,
    host: mysqlHost,
    user: mysqlUser,
    password: mysqlPassword,
    port: mysqlPort
});
mysqlDb.connect(err => { // Conecta com o banco de dados
    if (err) return console.error('Erro na conexão: ' + err.stack);
});

module.exports = mysqlDb;