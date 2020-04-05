var express = require('express')
const db = require('../db-connect')
var router = express.Router()

router.use(function adminLog (req, res, next) {
    console.log('<LOG> -', new Date().toUTCString())
    next()
})

router.post('/login', function (req, res) {
    console.log('<LOG> - Admin Login')
    const phone = req.body.phone
    const password = req.body.pass
    // encode pass
    db.connect();
    db.query('SELECT * FROM users WHERE phone = ? AND password = ?', [phone, password], function (err, result) {
        if (err) console.error(err)
        if (result.length > 0) {
            delete result[0].password
            res.json({
                message: 'Admin Login Success',
                user: result[0]
            })
        } else {
            res.json({
                message: 'Something went wrong. Check your credentials and try again.'
            })
        }
    })
    db.end()
})

module.exports = router

// INSERT INTO `users` (`id`, `name`, `user_type`, `email`, `phone`, `password`, `avatar`, `deleted`, `created_at`, `update_at`) VALUES (NULL, 'Admin', '0', 'admin@doggiehunt.co.il', '0666', 'admin', '', '', CURRENT_TIMESTAMP, '');