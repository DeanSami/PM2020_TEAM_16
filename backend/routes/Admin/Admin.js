const globals = require('../../globals')
const express = require('express')
const db = require('../../db-connect')
const router = express.Router()
const hat = require('hat')
const bcrypt = require('bcrypt')

const A_InterestPoints = require('./Admin_Interest_Points')
const A_DogParks = require('./Admin_Dog_Parks')

router.use('/interesting_point', A_InterestPoints)
router.use('/dog_parks', A_DogParks)

router.use(function isAdmin (req, res, next) {
    if (req.originalUrl == '/admin/login' || req.originalUrl == '/admin/register') next();
    else {
    console.log('<LOG> - POST /admin/* - Middleware')
        const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth'];
        if (incoming_token) {
            db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ? AND user_type = ?', [incoming_token, globals.user_types.admin], function (err, result) {
                if (err) {
                    console.log('<LOG> - POST /admin/* - ERROR');
                    console.error(err);
                    res.status(globals.status_codes.Server_Error).json(globals.messages.failure)
                }
                else if (result.length > 0) {
                    console.log('<LOG> - POST /admin/* - SUCCESS');
                    next()
                } else {
                    console.log('<LOG> - POST /admin/* - Unauthorized Access Attempt');
                    res.status(globals.status_codes.Forbidden).json(globals.messages.failure)
                }
            })
        } else {
            console.log('<LOG> - POST /admin/* - Missing Credentials');
            res.statusCode = 401;
            res.json(globals.messages.failure)
        }
    }
});

router.use(globals.log_func);

//REGISTER REQUEST
router.post('/register', function(req, res) {
    console.log("<LOG> - POST /admin/register")
    bcrypt.hash(req.body.pass, 10, function (err, hash) {
        const values = {phone: req.body.phone, password: hash, user_type: 0}
        db.query('INSERT INTO users SET ?', values, function (err, result) {
            if (!err) {
                console.log("<LOG> - POST /admin/register - ERROR")
                res.json(globals.messages.success)
            }
            else {
                console.log("<LOG> - POST /admin/register - SUCCESS")
                res.json(globals.messages.success)
            }
        })
    })
});
//LOGIN REQUEST
router.post('/login', function (req, res) {
    console.log('<LOG> - POST /admin/login - Invoke');
    const phone = req.body.phone;
    db.query('SELECT * FROM users WHERE phone = ?', [phone], function (err, phone_query_result) {
        if (err) {
            console.log('<LOG> - POST /admin/login - ERROR');
            console.error(err);
            res.json(globals.messages.failure)
        } else {
            if (phone_query_result.length > 0) {
                const password = req.body.pass;
                bcrypt.compare(password, phone_query_result[0].password, function (err, pass_compare) {
                    if (err) {
                        console.error(err);
                        res.json(globals.messages.failure)
                    } else {
                        if (!pass_compare) {
                            console.log('<LOG> - POST /admin/login - Wrong Credentials pass');
                            res.statusCode = 401;
                            res.json(globals.messages.failure)
                        } else {
                            delete phone_query_result[0].password;
                            var token = hat();
                            db.query('INSERT INTO user_sessions(user_id,session) VALUES (?,?)',[phone_query_result[0].id,token],function (err, insert_query_result){
                                if (err) {
                                    console.log('<LOG> - POST /admin/login - Wrong Values inserted');
                                    console.error(err);
                                    res.statusCode = 400
                                    res.json(globals.messages.failure)
                                } else {
                                    console.log('<LOG> - POST /admin/login - SUCCESS');
                                    res.json({
                                        status: true,
                                        token: token,
                                        user: phone_query_result[0]
                                    })
                                }
                            });
                        }
                    }
                })
            } else {
                console.log('<LOG> - POST /admin/login - Wrong Credentials');
                res.statusCode = 401;
                res.json(globals.messages.failure)
            }
        }
    })
});
//ADMIN LOGIN
router.get('/login', function (req, res) {
    console.log('<LOG> - GET /admin/login - Invoke');
    const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth']
    if (incoming_token) {
        db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ?', [incoming_token], function(err, result) {
            if (err) {
                console.log('<LOG> - GET /admin/login - ERROR');
                console.error(err);
                res.json(globals.messages.failure)
            } else {
                if (result.length > 0) {
                    delete result[0].password;
                    console.log('<LOG> - GET /admin/login - SUCCESS');
                    res.json({
                        status: true,
                        user: result[0]
                    })
                } else {
                    console.log('<LOG> - GET /admin/login - Unauthorized Credentials');
                    res.statusCode = 401;
                    res.json(globals.messages.failure)
                }
            }
        })
    } else {
        console.log('<LOG> - GET /admin/login - Credentials Missing');
        res.statusCode = 401;
        res.json(globals.messages.failure)
    }
});


module.exports = router;