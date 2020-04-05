const express = require('express')
const bodyParser = require('body-parser')

const Admin = require('./routes/Admin')

const db = require('./db-connect')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/admin', Admin)

app.get('/', (req, res) => res.json({message: 'Hello World!'}))

// db.connect();
// db.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//     if (err) console.log(err)
//     console.log('The solution is: ', rows[0].solution)
// })

// db.end()

module.exports = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
