const express = require('express')
const db = require('../db-connect')
const globals = require('../globals')
const router = express.Router()
const hat = require('hat')
const bcrypt = require('bcrypt')

router.use(function isAdmin (req, res, next) {
    if (req.originalUrl == '/admin/login' || req.originalUrl == '/admin/register') next()
    else {
    console.log('<LOG> - POST /admin/*')
        const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth']
        if (incoming_token) {
            db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ? AND user_type = ?', [incoming_token, globals.user_types.admin], function (err, result) {
                if (err) {
                    console.log('<LOG> - POST /admin/* - ERROR')
                    console.error(err)
                    res.statusCode = 400
                    res.json(globals.messages.failure)
                }
                else if (result.length > 0) {
                    console.log('<LOG> - POST /admin/* - SUCCESS')
                    next()
                } else {
                    console.log('<LOG> - POST /admin/* - Unauthorized Access Attempt')
                    res.statusCode = 401
                    res.json(globals.messages.failure)
                }
            })
        } else {
            console.log('<LOG> - POST /admin/* - Missing Credentials')
            res.statusCode = 401
            res.json(globals.messages.failure)
        }
    }
});

router.use(globals.log_func);

router.post('/dog_parks/add', function (req, res) {
    console.log('<LOG> - POST /admin/dog_parks/add')

    if (!req.body.user_input) {
        console.log('<LOG> - POST /dog_parks/add - Wrong Payload Format')
        res.statusCode = 400
        res.json(globals.messages.failure)
    } else {
        const {
            type,
            name,
            SHAPE_Leng,
            SHAPE_Area,
            street,
            house_number,
            neighborhood,
            operator,
            handicapped,
            condition
        } = req.body.user_input;

        if (type == undefined
            || name == undefined
            || SHAPE_Leng == undefined
            || SHAPE_Area == undefined 
            || house_number == undefined
            || neighborhood == undefined
            || operator == undefined
            || handicapped == undefined
            || condition == undefined)
            {
                console.log('<LOG> - POST /dog_parks/add - At least 1 field is missing')
                res.statusCode = 400
                res.json(globals.messages.failure)
            }
        else if (typeof(type) !== 'number'
            || typeof(name) !== 'string'
            || typeof(SHAPE_Leng) !== 'string'
            || typeof(SHAPE_Area) !== 'string'
            || typeof(house_number) !== 'string'
            || typeof(neighborhood) !== 'string'
            || typeof(operator) !== 'string'
            || typeof(handicapped) !== 'boolean'
            || typeof(condition) !== 'number')
        {
            console.log('<LOG> - POST /dog_parks/add - Error with type of at least 1 input field')
            res.statusCode = 400
            res.json(globals.messages.failure)
        } else {
            var values = {type:type, name:name, SHAPE_Leng:SHAPE_Leng, SHAPE_Area:SHAPE_Area, house_number:house_number,neighborhood:neighborhood, operator:operator, handicapped:handicapped, condition:condition};
            if (street !== undefined)
                values.street = street;
        
            db.query('INSERT INTO places SET ?', values, function (err, result) {
                if (err) {
                    console.log('<LOG> - POST /admin/dog_parks/add - ERROR')
                    console.error(err)
                    res.json(globals.messages.failure)
                } else {
                console.log('<LOG> - POST /admin/dog_parks/add SUCCESS')
                    res.json({
                        status: true
                    })
                }
            })
        }
    }

});

router.get('/dog_parks/get' , function(req, res) {
    console.log('<LOG> - Admin GET Park Dog');
    //if the clint want specific park dog
    if (req.body.id)
    {
        var temp_id = req.body.id;
        db.query('SELECT * FROM places WHERE id = ?',[temp_id] , function (err,result) {
            if(err)
                console.error(err);
            if (result.length == 0){
                res.statusCode = 401;
                res.json(globals.messages.failure);
            }
            console.log(result);
            res.json({
                status:true,
                place:result[0]
            })
        })
    }
    //if the clint want all the park dog that at the db
    else{
        //todo enum to set Places.dogPark and remove 0
        db.query('SELECT * FROM places WHERE deleted = 0 AND type = ?' ,[0],function (err,result) {
            if (err)
                console.error(err);
            if (result.length>0)
            {
                console.log(result);
                res.json({
                    status: true,
                    place: result
                })
            }
            else{
                res.statusCode = 400;
                res.json(globals.messages.failure);
            }

        })
    }


});
//delete park
router.post('/dog_parks/delete',function (req,res) {
    console.log('<LOG> - Admin DELETE Dog Park');
    if(req.body.id)
    {
        var temp_id = req.body.id;
        db.query('UPDATE places SET deleted = 1 WHERE id = ? ', [2],function (err,result) {
            console.log(result);
            if (err) {
                console.log('<LOG> - POST /admin/DELETE - ERROR');
                console.error(err);
                res.json(globals.messages.failure);
            } if (result.affectedRows > 0) {
                res.json({
                    status: true,
                    message: "delete action has been done",
                })
            } else {
                console.log('<LOG> - POST /admin/Delete - Wrong Parameters');
                res.statusCode = 400;
                res.json(globals.messages.failure);
            }

        });
    }
    else{
        console.error("not ID has been send");
        res.json(globals.messages.failure);
    }
});

router.post('/register', function(req, res) {
    bcrypt.hash(req.body.pass, 10, function (err, hash) {
        const values = {phone: req.body.phone, password: hash, user_type: 0}
        db.query('INSERT INTO users SET ?', values, function (err, result) {
            if (!err) res.json(globals.messages.success)
        })
    })
})

router.post('/login', function (req, res) {
    console.log('<LOG> - POST /admin/login');
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
                        console.log('<LOG> - POST /admin/login - ERROR');
                        console.error(err)
                        res.json(globals.messages.failure)
                    } else {
                        if (!pass_compare) {
                            console.log('<LOG> - POST /admin/login - Wrong Credentials pass');
                            res.statusCode = 401
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
                res.statusCode = 401
                res.json(globals.messages.failure)
            }
        }
    })
});

router.get('/login', function (req, res) {
    console.log('<LOG> - GET /admin/login');
    const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth']
    if (incoming_token) {
        db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ?', [incoming_token], function(err, result) {
            if (err) {
                console.log('<LOG> - GET /admin/login - ERROR');
                console.error(err)
                res.json(globals.messages.failure)
            } else {
                if (result.length > 0) {
                    delete result[0].password
                    console.log('<LOG> - GET /admin/login - SUCCESS');
                    res.json({
                        status: true,
                        user: result[0]
                    })
                } else {
                    console.log('<LOG> - GET /admin/login - Unauthorized Credentials');
                    res.statusCode = 401
                    res.json(globals.messages.failure)
                }
            }
        })
    } else {
        console.log('<LOG> - GET /admin/login - Credentials Missing');
        res.statusCode = 401
        res.json(globals.messages.failure)
    }
});




module.exports = router;
