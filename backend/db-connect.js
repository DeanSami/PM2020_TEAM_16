const mysql = require('mysql')
const globals = require('./globals')
var connection = mysql.createConnection({
    host: globals.DB.HOST,
    port: globals.DB.PORT,
    user: globals.DB.USER,
    password: globals.DB.PASS,
    database: globals.DB.NAME,
    multipleStatements: true
})

module.exports = connection
