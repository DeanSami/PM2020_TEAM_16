const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const globals = require('./globals')

const Admin = require('./routes/Admin/Admin')
const User = require('./routes/User/Users')

const app = express()
const port = globals.server_port

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/admin', Admin)

app.use('/user', User)

app.all('*', function (req, res) {
    res.status(globals.status_codes.Not_Found).json()
})

module.exports = app.listen(port, () => console.log(`Doggie Hunt Server Side listening at http://localhost:${port}`))
