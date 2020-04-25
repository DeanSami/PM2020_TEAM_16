var express = require('express');
const db = require('../../db-connect');
const globals = require('../../globals');
var router = express.Router();
var hat = require('hat');
const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'AKIAYNRPTGKU3FKSABHK',
    secretAccessKey: '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',
    region: 'eu-west-1'
});

const sns = new AWS.SNS();

router.use(globals.log_func);

/*
router.use(function isLogged (req, res, next) {
    if (req.originalUrl == '/user/login') next()
    else {
        console.log('<LOG> - POST /admin/*')
        const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth'];
        if (incoming_token) {
            db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ? AND user_type = ?', [incoming_token, globals.user_types.user], function (err, result) {
                if (err) {
                    console.log('<LOG> - POST /user/* - ERROR');
                    console.error(err);
                    res.status(globals.status_codes.Server_Error).json(globals.messages.failure);
                }
                else if (result.length > 0) {
                    console.log('<LOG> - POST /user/* - SUCCESS');
                    next();
                } else {
                    console.log('<LOG> - POST /user/* - Unauthorized Access Attempt');
                    res.status(globals.status_codes.Unauthorized).json(globals.messages.failure);
                }
            })
        } else {
            console.log('<LOG> - POST /user/* - Missing Credentials');
            // res.json.status(globals.status_codes.Unauthorized).(globals.messages.failure);
        }
    }
});

router.use(globals.log_func);

router.post('/login', function (req, res) {
    console.log('<LOG> - POST /user/login');
    const phone = req.body.phone;
    const password = req.body.pass;
    db.query('SELECT * FROM users WHERE phone = ? AND password = ?', [phone, password], function (err, result) {
        if (err) {
            console.log('<LOG> - POST /user/login - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json(globals.messages.failure)
        } else {
            if (result.length > 0) {
                delete result[0].password;
                var token = hat();
                db.query('INSERT INTO user_sessions(user_id,session) VALUES (?,?)',[result[0].id,token],function (err, result){
                    if (err) {
                        console.log('<LOG> - POST /user/login - Wrong Credentials');
                        console.error(err);
                        res.status(globals.status_codes.Unauthorized).json(globals.messages.failure)
                    } else {
                        console.log('<LOG> - POST /user/login - SUCCESS');
                        res.status(globals.status_codes.OK).json({
                            status: true,
                            token: token,
                            user: result[0]
                        })
                    }
                });
            } else {
                console.log('<LOG> - user Login Wrong Credentials');
                res.statusCode = 401
                res.status(globals.status_codes.Unauthorized).json(globals.messages.failure)
            }
        }
    })
});
*/

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
