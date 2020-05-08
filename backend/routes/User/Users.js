const express = require('express');
const db = require('../../db-connect');
const globals = require('../../globals');
const router = express.Router();
const hat = require('hat');
const AWS = require('aws-sdk');
const config = require('./configs/config.js')
AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    region: config.AWS.region
});

const GAMES = require('./Games')
const PLACES = require('./Places')
const sns = new AWS.SNS();

router.use(globals.log_func);
router.use('/games', GAMES);
router.use('/places', PLACES);

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
                    res.status(globals.status_codes.OK).json(result[0])
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

router.get('/sendSms', function (req, res) {
    console.log('<LOG> - POST /user/sendSms');
    if (req && req.body && req.body.phone) {
        let name = req.body.name ? req.body.name : '';
        let user_type = req.body.user_type ? req.body.user_type : '';
        let phone = req.body.phone.replace(/\D/g,'');
        if (phone.search('972') >= 0) {
            phone = '+' + phone;
        } else {
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
                if (result.length === 0) {
                    db.query('INSERT INTO users (name, user_type, email, phone, password, avatar) VALUES (?,?,?,?,?,?)',
                        [name, user_type, '', phone.split('+972')[1], '', ''],function (err, result){
                        if (err) {
                            console.log('<LOG> - GET user/sendSms - fail insert user');
                            console.error(err);
                            res.status(globals.status_codes.Bad_Request).json();
                        } else {
                            insertSessionAndSendSms(user, token, code, phone, res);
                        }
                    });
                } else {
                    insertSessionAndSendSms(user, token, code, phone, res);
                }
            }
        });
    } else {
        res.status(globals.status_codes.Bad_Request).json();
    }

});

function insertSessionAndSendSms(user, token, code, phone, res) {
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
                sendSms(phone, 'קוד האימות שלך הוא: ' + code, (err, result) => {
                    if (err) {
                        console.log('<LOG> - GET user/sendSms - fail send sms');
                        res.status(globals.status_codes.Bad_Request).json({token});
                    } else {
                        console.log('<LOG> - GET user/sendSms - SUCCESS');
                        res.status(globals.status_codes.OK).json({token});
                    }
                });
            }
        });
    });
}

function sendSms(phone, message, callback) {
    console.log('got param: ', phone, message);
    sns.publish({
        Message: message,
        PhoneNumber: phone
    }, callback);
}

module.exports = router;
