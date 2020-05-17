const express = require('express');
const db = require('../../db-connect');
const globals = require('../../globals');
const router = express.Router();
const hat = require('hat');
const AWS = require('aws-sdk');
let config;
try {
    config = require('../../configs/config')
} catch {
    config = require('../../configs/config.simple')
}
AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    region: config.AWS.region
});

const GAMES = require('./Games')
const PLACES = require('./Places')
const BUSINESS = require('./Business')
const sns = new AWS.SNS();

router.use(function isUser (req, res, next) {
    if (req.originalUrl.toLowerCase() === '/user/games/edit' ||
        req.originalUrl.toLowerCase() === '/user/games/create' ||
        req.originalUrl.toLowerCase() === '/user/business/edit' ||
        req.originalUrl.toLowerCase() === '/user/business/create' ||
        req.originalUrl.toLowerCase() === '/user/games/played' ||
        req.originalUrl.toLowerCase() === '/user/games/mygames' ||
        req.originalUrl.toLowerCase() === '/user/edituser'
    ) {
        console.log('<LOG> - POST /user/* - Middleware')
        const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth'];
        if (incoming_token) {
            db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ? AND user_type != ?', [incoming_token, globals.user_types.admin], function (err, result) {
                if (err) {
                    console.log('<LOG> - POST /user/* - ERROR');
                    console.error(err);
                    res.status(globals.status_codes.Server_Error).json();
                }
                else if (result.length > 0) {
                    if (req.originalUrl.toLowerCase() === '/user/games/edit' ||
                        req.originalUrl.toLowerCase() === '/user/games/create' ||
                        req.originalUrl.toLowerCase() === '/user/business/edit' ||
                        req.originalUrl.toLowerCase() === '/user/business/create' ||
                        req.originalUrl.toLowerCase() === '/user/games/played' ||
                        req.originalUrl.toLowerCase() === '/user/games/mygames' ||
                        req.originalUrl.toLowerCase() === '/user/edituser'
                    ) {
                        if (req.originalUrl.toLowerCase() === '/user/games/mygames') {
                            if (result[0].id !== req.body.id && !isNaN(req.body.id)) {
                                console.log('<LOG> - POST /user/* - Unauthorized Access Attempt');
                                res.status(globals.status_codes.Unauthorized).json();
                                return;
                            } else {
                                console.log('<LOG> - POST /user/* - SUCCESS');
                                next();
                                return;
                            }
                        }
                        if (result[0].id !== req.body.owner_id && !isNaN(req.body.owner_id)) {
                            console.log('<LOG> - POST /user/* - Unauthorized Access Attempt');
                            res.status(globals.status_codes.Unauthorized).json();
                            return;
                        }
                        if (req.originalUrl === '/user/games/played') {
                            if (req.body.game_id && !isNaN(req.body.game_id)) {
                                db.query('SELECT * FROM games WHERE id = ? AND owner_id = ?', [req.body.game_id, req.body.owner_id], function (err, result) {
                                    if (err) {
                                        console.log('<LOG> - GET /user/login - ERROR');
                                        console.error(err);
                                        res.status(globals.status_codes.Server_Error).json()
                                    } else {
                                        if (result && result.length > 0) {
                                            console.log('<LOG> - POST /user/played - SUCCESS');
                                            next();
                                        } else {
                                            res.status(globals.status_codes.Unauthorized).json();
                                        }
                                    }
                                });
                            } else {
                                res.status(globals.status_codes.Unauthorized).json();
                            }
                        }
                        if (req.originalUrl === '/user/editUser') {
                            if (result[0].id !== req.body.id) {
                                console.log('<LOG> - POST /user/* - Unauthorized Access Attempt');
                                res.status(globals.status_codes.Unauthorized).json();
                                return;
                            } else {
                                console.log('<LOG> - POST /user/* - SUCCESS');
                                next();
                            }
                        } else {
                            console.log('<LOG> - POST /user/* - SUCCESS');
                            next();
                        }
                    } else {
                        console.log('<LOG> - POST /user/* - SUCCESS');
                        next();
                    }
                } else {
                    console.log('<LOG> - POST /user/* - Unauthorized Access Attempt');
                    res.status(globals.status_codes.Unauthorized).json();
                }
            })
        } else {
            console.log('<LOG> - POST /user/* - Missing Credentials');
            res.status(globals.status_codes.Unauthorized).json();
        }
    } else {
        next();
    }
});

router.use(globals.log_func);
router.use('/games', GAMES);
router.use('/places', PLACES);
router.use('/business', BUSINESS);


router.post('/editUser', function (req, res) {
    console.log('<LOG> - GET /user/edit - Invoke');

    // todo validate birthday
    let user = {
        name: typeof req.body.name === 'string' ?  req.body.name.replace(';', '').replace(',', '') : '',
        email: typeof req.body.email === 'string' ?  escape(req.body.email) : '',
        avatar: typeof req.body.avatar === 'string' ?  escape(req.body.avatar) : '',
        birthday: typeof req.body.birthday === 'string' ?  req.body.birthday : null,
        gender: isNaN(req.body.gender) ? null : (req.body.gender === 0 ? 0 : 1),
        hobbies: isNaN(req.body.hobbies) ? 0 : req.body.hobbies
    };
    if (user.avatar === '') {
        delete user.avatar;
    }
    if (user.email === '') {
        delete user.email;
    }
    if (user.name === '') {
        delete user.name;
    }
    if (user.birthday === '') {
        delete user.birthday;
    }
    if (user.gender === null) {
        delete user.gender;
    }

    db.query('UPDATE users SET ? WHERE id = ?', [user, req.body.id], function(err, result) {
        if (err) {
            console.log('<LOG> - GET /user/edit - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json()
        } else {
            console.log('<LOG> - GET /user/login - SUCCESS');
            res.status(globals.status_codes.OK).json()
        }
    })
});

router.get('/login', function (req, res) {
    console.log('<LOG> - GET /user/login - Invoke');
    const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth']
    if (incoming_token) {
        db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ?', [incoming_token], function(err, result) {
            if (err) {
                console.log('<LOG> - GET /user/login - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json()
            } else {
                if (result.length > 0) {
                    delete result[0].password;
                    console.log('<LOG> - GET /user/login - SUCCESS');
                    if (result[0].avatar === '') {
                        result[0].avatar = 'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/defaultAvater.jpg';
                    } else {
                        result[0].avatar = 'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/userImages/' + result[0].avatar;
                    }
                    db.query('SELECT * FROM businesses WHERE owner_id  = ?', [result[0].user_id], function(err, businesses_res) {
                        if (err) {
                            console.log('<LOG> - GET /user/login - ERROR');
                            console.error(err);
                            res.status(globals.status_codes.Server_Error).json();
                        } else {
                            result[0].businesses = businesses_res;
                            res.status(globals.status_codes.OK).json(result[0]);
                        }
                    })
                } else {
                    console.log('<LOG> - GET /admin/login - Unauthorized Credentials');
                    res.status(globals.status_codes.Unauthorized).json()
                }
            }
        })
    } else {
        console.log('<LOG> - GET /admin/login - Credentials Missing');
        res.status(globals.status_codes.Bad_Request).json()
    }
});




router.get('/checkValidationCode', function (req, res) {
    console.log('<LOG> - POST /user/check code');
    if (req && req.query && req.query.phone && req.query.code && req.query.phone && !isNaN(req.query.code)) {
        let phone = req.query.phone.replace(/\D/g,'');
        let code = req.query.code;
        if (phone.indexOf('111') === 0) {
            phone = phone.slice(3);
        }
        if (phone.indexOf('+972') === 0) {
            phone = phone.split('+972')[1];
        }

        db.query('SELECT * FROM users, user_sessions WHERE users.id = user_sessions.user_id AND phone = ? AND validation_code = ? AND user_sessions.deleted = 0', [phone, code], function(err, result) {
            if (err) {
                console.log('<LOG> - GET user/sendSms - ERROR check validation code');
                console.error(err);
                res.status(globals.status_codes.Bad_Request).json()
            } else {
                if (result.length > 0) {
                    let user = result[0];
                    console.log('<LOG> - GET user/sendSms - SUCCESS');
                    res.status(globals.status_codes.OK).json({token: user.session});
                } else {
                    res.status(globals.status_codes.Bad_Request).json({message: 'incorrect validation code'});
                }
            }
        });
    } else {
        res.status(globals.status_codes.Bad_Request).json({message: 'missing arguments'});
    }
});


function insertSessionAndSendSms(user, token, code, phone, res, debug_mode = false) {
    db.query('UPDATE user_sessions SET deleted = 1 WHERE user_id = ?',[user.id],function (err, result){
        if (err){
            console.log('error deleted old sessions', err);
        }
        db.query('INSERT INTO user_sessions(user_id, session, validation_code) VALUES (?,?,?)',[user.id, token, code],function (err, result){
            let user_session = result.user
            if (err) {
                console.log('<LOG> - GET user/sendSms - fail insert session');
                console.error(err);
                res.status(globals.status_codes.Bad_Request).json();
            } else {
                if (debug_mode) {
                    console.log('<LOG> - GET user/sendSms - SUCCESS');
                    res.status(globals.status_codes.OK).json();
                } else {
                    sendSms(phone, 'קוד האימות שלך הוא: ' + code, (err, result) => {
                        if (err) {
                            console.log('<LOG> - GET user/sendSms - fail send sms');
                            res.status(globals.status_codes.Bad_Request).json(err);
                        } else {
                            console.log('<LOG> - GET user/sendSms - SUCCESS');
                            res.status(globals.status_codes.OK).json();
                        }
                    });
                }
            }
        });
    });
}

router.get('/sendSms', function (req, res) {
    console.log('<LOG> - POST /user/sendSms');
    if (req && req.query && req.query.phone) {
        let name = req.query.name ? req.query.name : '';
        let user_type = req.query.user_type ? req.query.user_type : 1;
        let phone = req.query.phone.replace(/\D/g,'');
        /* testing login no sms */
        let debug_mode = false;
        if (phone.indexOf('111') === 0) {
            debug_mode = true;
            phone = phone.slice(3);
        }
        if (phone.indexOf('+972') !== 0) {
            phone = '+972' + phone;
        }

        db.query('SELECT * FROM users WHERE phone = ? AND user_type != 0 LIMIT 1', [phone.split('+972')[1]], function(err, result) {
            if (err) {
                console.log('<LOG> - GET user/sendSms - ERROR get user');
                console.error(err);
                res.status(globals.status_codes.Bad_Request).json()
            } else {
                let user = result[0];
                let token = hat();
                let code = Math.floor(100000 + Math.random() * 900000);
                if (debug_mode) {
                    code = 123456;
                }
                if (result.length === 0) {
                    db.query('INSERT INTO users (name, user_type, email, phone, password, avatar) VALUES (?,?,?,?,?,?)',
                        [name, user_type, '', phone.split('+972')[1], '', ''],function (err, result){
                            if (err) {
                                console.log('<LOG> - GET user/sendSms - fail insert user');
                                console.error(err);
                                res.status(globals.status_codes.Bad_Request).json();
                            } else {
                                db.query('SELECT * FROM users WHERE id = ?', [result.insertId], function(err, result) {
                                    if (err) {
                                        console.log('<LOG> - GET user/sendSms - fail insert user');
                                        console.error(err);
                                        res.status(globals.status_codes.Bad_Request).json();
                                    } else {
                                        user = result[0];
                                        insertSessionAndSendSms(user, token, code, phone, res, debug_mode);
                                    }
                                });
                            }
                        });
                } else {
                    insertSessionAndSendSms(user, token, code, phone, res, debug_mode);
                }
            }
        });
    } else {
        res.status(globals.status_codes.Bad_Request).json();
    }
});

function sendSms(phone, message, callback) {
    console.log('got param: ', phone, message);
    sns.publish({
        Message: message,
        PhoneNumber: phone
    }, callback);
}

module.exports = router;
