var express = require('express');
const db = require('../db-connect');
var router = express.Router();
var hat = require('hat');
router.use(function adminLog (req, res, next) {
    console.log('<LOG> -', new Date().toUTCString());
    next();
});

router.use(function isAdmin (req, res, next) {
    if (req.originalUrl != '/admin/login') {
<<<<<<< HEAD
        console.log(JSON.stringify(req.headers))
=======
        console.log(JSON.stringify(req.headers)['accept']);
>>>>>>> 09a9fd3797f558b63af6be31a5a659446aa596dd
    }
    next();
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
    } = req.body

    //......
    // validate admin
    // connect db
    // query from db
    // filter results
    // return information
    //......
    res.json({});
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
            console.log("token:", token);
            res.json({
                message: 'Admin Login Success',
                token: token,
                user: result[0]
            })
        } else {
            res.json({
                message: 'Something went wrong. Check your credentials and try again.'
            })
        }
    })
});

module.exports = router;

// INSERT INTO `users` (`id`, `name`, `user_type`, `email`, `phone`, `password`, `avatar`, `deleted`, `created_at`, `update_at`) VALUES (NULL, 'Admin', '0', 'admin@doggiehunt.co.il', '0666', 'admin', '', '', CURRENT_TIMESTAMP, '');