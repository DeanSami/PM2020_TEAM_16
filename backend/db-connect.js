var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3308,
    user: 'root',
    password: '',
    database: 'pm2020_team16'
})


module.exports = connection