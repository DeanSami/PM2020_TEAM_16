var express = require('express');
const db = require('../db-connect');
const globals = require('../globals')
var router = express.Router();
var hat = require('hat');

router.use(function adminLog (req, res, next) {
    console.log('<LOG> -', new Date().toUTCString());
    next();
});

router.use(function isAdmin (req, res, next) {
    if (req.originalUrl != '/admin/login') {
        const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth']
        db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ? AND user_type = ?', [incoming_token, globals.user_types.admin], function (err, result) {
            if (err) console.error(err)
            if (result.length > 0) {
                next()
            } else
                res.json(globals.messages.failure)
        })
    } else
        res.json(globals.messages.failure)
});

router.post('/dog_parks/add', function (req, res) {
    console.log('<LOG> - Admin Add New Park Dog')

    const {
        name, 
        SHAPE_Leng, 
        SHAPE_Area, 
        street, 
        house_number, 
        neighborhood, 
        operator, 
        handicapped, 
        condition 
    } = req.body.user_input

    var values = [[name, SHAPE_Leng, SHAPE_Area, street, house_number, neighborhood, operator, handicapped, condition]]

    db.query('INSERT INTO places(name,SHAPE_Leng,SHAPE_Area,street,house_number,neighborhood,operator,handicapped,condition) VALUES ?', [values], function (err, result) {
        if (err) {
            console.error(err)
            res.json(globals.messages.failure)
        }
        console.log(result)
        res.json({
            status: true
        })
    })
    
    res.json(globals.messages.failure);
});

router.post('/login', function (req, res) {
    console.log('<LOG> - Admin Login');
    const phone = req.body.phone;
    const password = req.body.pass;
    // encode pass
    db.query('SELECT * FROM users WHERE phone = ? AND password = ?', [phone, password], function (err, result) {
        if (err) console.error(err);
        if (result.length > 0) {
            delete result[0].password;
            // create token for user
            var token = hat();
            // insert to db to user_sessions
            db.query('INSERT INTO user_sessions(user_id,session) VALUES (?,?)',[result[0].id,token],function (err, result){
                if (err) console.error(err);
            });
            res.json({
                status: true,
                token: token,
                user: result[0]
            })
        } else {
            res.json(globals.messages.failure)
        }
    })
});

module.exports = router;

// INSERT INTO `users` (`id`, `name`, `user_type`, `email`, `phone`, `password`, `avatar`, `deleted`, `created_at`, `update_at`) VALUES (NULL, 'Admin', '0', 'admin@doggiehunt.co.il', '0666', 'admin', '', '', CURRENT_TIMESTAMP, '');