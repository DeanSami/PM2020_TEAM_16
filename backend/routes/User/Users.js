const express = require('express');
const db = require('../../db-connect');
const globals = require('../../globals');
const router = express.Router();
const hat = require('hat');
const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'AKIAYNRPTGKU3FKSABHK',
    secretAccessKey: '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',
    region: 'eu-west-1'
});

const GAMES = require('./Games')
const sns = new AWS.SNS();

router.use(globals.log_func);
router.use('/games', GAMES);

//LOGIN REQUEST
router.post('/login', function (req, res) {
    console.log('<LOG> - POST /user/login - Invoke');
    const phone = req.body.phone;
    db.query('SELECT * FROM users WHERE phone = ?', [phone], function (err, phone_query_result) {
        if (err) {
            console.log('<LOG> - POST /admin/login - ERROR');
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
                            console.log('<LOG> - POST /admin/login - Wrong Credentials pass');
                            res.status(globals.status_codes.Unauthorized).json()
                        } else {
                            delete phone_query_result[0].password;
                            var token = hat();
                            db.query('INSERT INTO user_sessions(user_id,session) VALUES (?,?)',[phone_query_result[0].id,token],function (err, insert_query_result){
                                if (err) {
                                    console.log('<LOG> - POST /admin/login - Wrong Values inserted');
                                    console.error(err);
                                    res.status(globals.status_codes.Unauthorized).json()
                                } else {
                                    console.log('<LOG> - POST /admin/login - SUCCESS');
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
                console.log('<LOG> - POST /admin/login - Wrong Credentials');
                res.status(globals.status_codes.Unauthorized).json()
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
                res.status(globals.status_codes.Server_Error).json()
            } else {
                if (result.length > 0) {
                    delete result[0].password;
                    console.log('<LOG> - GET /admin/login - SUCCESS');
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

router.post('/sendSms', function (req, res) {
    console.log('<LOG> - POST /user/sendSms');
    if (req && req.body && req.body.phone) {

        // todo check if user exist and create one if needed
        // todo add to db row with userId and session key and 6 digit random validation code
        let code = '123123';
        sendSms(req.body.phone, 'your validation code: ' + code, (err, result) => {
            console.log('error: ', err);
            console.log('result: ', result);
            res.status(globals.status_codes.OK).json();
        });
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
