const globals = require('../../globals')
const express = require('express')
const db = require('../../db-connect')
const router = express.Router()
const hat = require('hat')
const bcrypt = require('bcrypt')

const A_InterestPoints = require('./Admin_Interest_Points')
const A_DogParks = require('./Admin_Dog_Parks')

router.use(function isAdmin (req, res, next) {
    if (req.originalUrl == '/admin/login' || req.originalUrl == '/admin/register') next();
    else {
    globals.log_msg('POST /admin/* - Middleware')
        const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth'];
        if (incoming_token) {
            db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ? AND user_type = ?', [incoming_token, globals.user_types.admin], function (err, result) {
                if (err) {
                    globals.log_msg('POST /admin/* - ERROR');
                    console.error(err);
                    res.status(globals.status_codes.Server_Error).json()
                }
                else if (result.length > 0) {
                    globals.log_msg('POST /admin/* - SUCCESS');
                    next()
                } else {
                    globals.log_msg('POST /admin/* - Unauthorized Access Attempt');
                    res.status(globals.status_codes.Forbidden).json()
                }
            })
        } else {
            globals.log_msg('POST /admin/* - Missing Credentials');
            res.status(globals.status_codes.Forbidden).json()
        }
    }
});

router.use(globals.log_func);

router.use('/interesting_point', A_InterestPoints)
router.use('/dog_parks', A_DogParks)

//REGISTER REQUEST
router.post('/register', function(req, res) {
    console.log("<LOG> - POST /admin/register")
    bcrypt.hash(req.body.pass, 10, function (err, hash) {
        const values = {name: req.body.phone, email: req.body.phone, avatar: req.body.phone, deleted: 0, phone: req.body.phone, password: hash, user_type: 0}
        db.query('INSERT INTO users SET ?', values, function (err, result) {
            if (err) {
                console.log("<LOG> - POST /admin/register - ERROR")
                console.error(err);
                res.status(globals.status_codes.Server_Error).json()
            }
            else {
                console.log("<LOG> - POST /admin/register - SUCCESS")
                res.status(globals.status_codes.OK).json()
            }
        })
    })
});
//LOGIN REQUEST
router.post('/login', function (req, res) {
    globals.log_msg('POST /admin/login - Invoke');
    const phone = req.body.phone;
    db.query('SELECT * FROM users WHERE phone = ?', [phone], function (err, phone_query_result) {
        if (err) {
            globals.log_msg('POST /admin/login - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json()
        } else {
            if (phone_query_result.length > 0) {
                const password = req.body.pass;
                bcrypt.compare(password, phone_query_result[0].password, function (err, pass_compare) {
                    if (err) {
                        console.error(err);
                        res.status(globals.status_codes.Server_Error).json()
                    } else {
                        if (!pass_compare) {
                            globals.log_msg('POST /admin/login - Wrong Credentials pass');
                            res.status(globals.status_codes.Unauthorized).json()
                        } else {
                            delete phone_query_result[0].password;
                            var token = hat();
                            db.query('INSERT INTO user_sessions(user_id,session) VALUES (?,?)',[phone_query_result[0].id,token],function (err, insert_query_result){
                                if (err) {
                                    globals.log_msg('POST /admin/login - Wrong Values inserted');
                                    console.error(err);
                                    res.status(globals.status_codes.Unauthorized).json()
                                } else {
                                    globals.log_msg('POST /admin/login - SUCCESS');
                                    res.status(globals.status_codes.OK).json({
                                        token: token,
                                        user: phone_query_result[0]
                                    })
                                }
                            });
                        }
                    }
                })
            } else {
                globals.log_msg('POST /admin/login - Wrong Credentials');
                res.status(globals.status_codes.Unauthorized).json()
            }
        }
    })
});
//ADMIN LOGIN
router.get('/login', function (req, res) {
    globals.log_msg('GET /admin/login - Invoke');
    const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth']
    if (incoming_token) {
        db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ?', [incoming_token], function(err, result) {
            if (err) {
                globals.log_msg('GET /admin/login - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json()
            } else {
                if (result.length > 0) {
                    delete result[0].password;
                    globals.log_msg('GET /admin/login - SUCCESS');
                    res.status(globals.status_codes.OK).json(result[0])
                } else {
                    globals.log_msg('GET /admin/login - Unauthorized Credentials');
                    res.status(globals.status_codes.Unauthorized).json()
                }
            }
        })
    } else {
        globals.log_msg('GET /admin/login - Credentials Missing');
        res.status(globals.status_codes.Bad_Request).json()
    }
});

router.get('/businesses', function (req, res) {
    globals.log_msg('GET /admin/businesses - Invoke');
    db.query('SELECT businesses.*, users.name as owner_name FROM businesses, users WHERE users.id = businesses.owner_id', [], function(err, result) {
        if (err) {
            globals.log_msg('GET /admin/businesses - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json()
        } else {
            globals.log_msg('GET /admin/businesses - SUCCESS');
            res.status(globals.status_codes.OK).json(result)
        }
    })
});

router.get('/getAdmins', function (req, res) {
    globals.log_msg('GET /admin/getAdmins - Invoke');
    db.query('SELECT id, name, email, phone, created_at FROM users WHERE user_type = ?', [0], function(err, result) {
        if (err) {
            globals.log_msg('GET /admin/getAdmins - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json()
        } else {
            globals.log_msg('GET /admin/getAdmins - SUCCESS');
            res.status(globals.status_codes.OK).json(result)
        }
    })
});

router.get('/getPlayers', function(req, res) {
    globals.log_msg('GET /admin/getPlayers - Invoke');
    db.query('SELECT users.name, users.user_type, users.email, users.phone, users.avatar, users.birthday, users.hobbies, users.created_at, users.update_at FROM users, active_players WHERE users.id = active_players.user_id', function(err, result) {
        if (err) {
            globals.log_msg('GET /admin/getPlayers - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json()
        } else {
            globals.log_msg('GET /admin/getPlayers - SUCCESS');
            res.status(globals.status_codes.OK).json(result)
        }
    })
})


module.exports = router;
