const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const globals = require('./globals')


const Admin = require('./routes/Admin')

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/admin', Admin)

app.get('/', (req, res) => res.json(globals.messages.success))

// db.connect();
// db.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//     if (err) console.log(err)
//     console.log('The solution is: ', rows[0].solution)
// })

// db.end()

module.exports = app.listen(port, () => console.log(`Doggie Hunt Server Side listening at http://localhost:${port}`))
